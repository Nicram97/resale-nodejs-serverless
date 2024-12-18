import { autoInjectable } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { CartRepository } from "../repository/cartRepository";
import { VerifyToken } from "../utils/password";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utils/errors";
import { CartInput } from "../models/dto/CartInput";
import { CartItemModel } from "../models/CartItemModel";
import { ShoppingCartModel } from "../models/ShoppingCartModel";
import { PullData } from "../message-queue";

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
        return SuccessResponse({
            message: 'response from Get Cart',
        });
    }

    async EditCart(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Edit Cart',
        });
    }

    async DeleteCart(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Delete Cart',
        });
    }
}