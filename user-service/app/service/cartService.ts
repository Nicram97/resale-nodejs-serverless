import { autoInjectable } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { CartRepository } from "../repository/cartRepository";
import { VerifyToken } from "../utils/password";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utils/errors";
import { CartInput, UpdateCartInput } from "../models/dto/CartInput";
import { CartItemModel } from "../models/CartItemModel";
import { ShoppingCartModel } from "../models/ShoppingCartModel";
import { PullData } from "../message-queue";
import aws from 'aws-sdk';
import { UserRepository } from "../repository/userRepository";
import { APPLICATION_FEE, CreatePaymentSession, RetrievePayment, STRIPE_FEE } from "../utils/payment";

@autoInjectable()
export class CartService {
    repository: CartRepository;

    constructor(userRepository: CartRepository) {
        this.repository = userRepository;
    }

    // Cart section
    async CreateCart(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);
        if (!payload) return ErrorResponse(403, 'authorization failed');

        const input = plainToClass(CartInput, event.body);
        const error = await AppValidationError(input);
        if (error) {
            return ErrorResponse(404, error);
        }

        try {
            let currentCart = await this.repository.findShoppingCart(payload.user_id);
            if (!currentCart) {
                currentCart = await this.repository.createShoppingCart(payload.user_id);
            }

            if (!currentCart) {
                return ErrorResponse(500, 'create card failed');
            }

            // find the item if exist
            let currentProduct = await this.repository.findCartItemByProuctId(
                input.productId
            )
            // if exist update the qty
            if (currentProduct) {
                await this.repository.updateCartItemByProductId(
                    input.productId,
                    currentProduct.item_qty += input.qty
                );
            } else {
            // if does not, call Product service to get product information
                const { data, status } = await PullData({
                    action: 'PULL_PRODUCT_DATA',
                    productId: input.productId
                });
                if (status !== 200) {
                    return ErrorResponse(500, 'failed to get product data');
                }

                let cartItem = data.data as CartItemModel;
                cartItem.cart_id = (currentCart as ShoppingCartModel).cart_id;
                cartItem.item_qty = input.qty;
                // fianlly create cart item
                await this.repository.createCartItem(cartItem);
            }
            // return all cart items to client
            const cartItems = await this.repository.findCartItemsByCartId(currentCart.cart_id);
            return SuccessResponse(cartItems as CartItemModel[]);
        } catch(e) {
            return ErrorResponse(500, e);
        }
    }

    async GetCart(event: APIGatewayProxyEventV2) {
        try {
            const token = event.headers.authorization;
            const payload = await VerifyToken(token);
            if (!payload) return ErrorResponse(403, 'authorization failed');

            const cartItems  = await this.repository.findCartItems(payload.user_id);
            const productsAmountToPay = cartItems.reduce(
                (sum, item) => sum + item.price * item.item_qty,
                0
            );
            const appFee = APPLICATION_FEE(productsAmountToPay) + STRIPE_FEE(productsAmountToPay);

            return SuccessResponse({
                cartItems,
                totalAmount: productsAmountToPay,
                appFee
            });
        } catch(e) {
            return ErrorResponse(500, e);
        }
    }

    async EditCart(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);
        const cartItemId = Number(event.pathParameters.id);
        if (!payload) return ErrorResponse(403, 'authorization failed');

        const input = plainToClass(UpdateCartInput, event.body);
        const error = await AppValidationError(input);
        if (error) {
            return ErrorResponse(404, error);
        }

        try {
            const cartItem = await this.repository.updateCartItemById(
                cartItemId,
                input.qty
            );

            if (cartItem) {
                return SuccessResponse(cartItem as CartItemModel);
            }
            return ErrorResponse(404, 'item not found');
        } catch(e) {
            return ErrorResponse(500, e);
        }
    }

    async DeleteCart(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);
        const cartItemId = Number(event.pathParameters.id);
        if (!payload) return ErrorResponse(403, 'authorization failed');

        try {
            const deletedItem = await this.repository.deleteCartItem(
                cartItemId,
            );

            if (deletedItem) {
                return SuccessResponse(deletedItem);
            }
            return ErrorResponse(404, 'item not found');
        } catch(e) {
            return ErrorResponse(500, e);
        }
    }

    async CollectPayment(event: APIGatewayProxyEventV2) {
        try {
            // check user
            const token = event.headers.authorization;
            const payload = await VerifyToken(token);
            if (!payload) return ErrorResponse(403, 'authorization failed');

            const { stripe_id, email, phone } = await new UserRepository().getUserProfile(payload.user_id);
            const cartItems  = await this.repository.findCartItems(payload.user_id);

            const productsAmountToPay = cartItems.reduce(
                (sum, item) => sum + item.price * item.item_qty,
                0
            );
            const appFee = APPLICATION_FEE(productsAmountToPay);
            const stripeFee = STRIPE_FEE(productsAmountToPay);
            const amountAndFees = productsAmountToPay + appFee + stripeFee;

            // initialize Payment gateway
            const { client_secret, public_key, customerId, paymentId } = await CreatePaymentSession({
                email,
                phone,
                amount: amountAndFees,
                customerId: stripe_id
            });

            await new UserRepository().updateUserPayment({
                userId: payload.user_id,
                paymentId,
                customerId,
            });

            return SuccessResponse({
                client_secret, public_key
            });

        } catch(e) {
            return ErrorResponse(500, e);
        }
    }

    async PlaceOrder(event: APIGatewayProxyEventV2) {
        // check user
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);
        if (!payload) return ErrorResponse(403, 'authorization failed');

        // verify payment
        const { payment_id } = await new UserRepository().getUserProfile(payload.user_id);
        const paymentInfo = await RetrievePayment(payment_id);
        console.log(paymentInfo);

        if (paymentInfo.status === 'succeeded') {
            // get cart items
            const cartItems  = await this.repository.findCartItems(payload.user_id);

            // send data to SNS topic to create Order [Transaction MS] => email to user
            const params = {
                Message: JSON.stringify({
                    userId: payload.user_id,
                    items: cartItems,
                    transaction: paymentInfo
                }),
                TopicArn: process.env.SNS_TOPIC,
                MessageAttributes: {
                    actionType: {
                        DataType: "String",
                        StringValue: "place_order"
                    }
                }
            }
            const sns = new aws.SNS();
            const response = await sns.publish(params).promise();
            console.log(response)
            return SuccessResponse({ msg: 'success', params });
        }
        return ErrorResponse(503, new Error('payment failed'));
    }
}