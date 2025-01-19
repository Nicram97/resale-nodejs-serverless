import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utils/errors";
import { ProductInput } from "../dto/product-input";
import { CategoryRepository } from "../repository/category-repository";
import { ServiceInput } from "../dto/service-input";
import { VerifyToken, UserType } from "../utils/auth";
export class ProductService {
    repository: ProductRepository;

    constructor(repository: ProductRepository) {
        this.repository = repository;
    }

    // if provided user can manage products (if user sending the request is the user which is creator of the certain product)
    async authorizedUser(user_id: number, productId: string) {
        const product = await this.repository.getProductById(productId);

        if (!product) return false;
        
        console.log('user_id', user_id, 'seller_id', product.seller_id, typeof user_id, typeof product.seller_id, user_id === product.seller_id);
        return Number(user_id) === Number(product.seller_id);
    }

    async ResponseWithError(event: APIGatewayEvent) {
        return ErrorResponse(404, new Error('method not allowed!'));
    }

    async createProduct(event: APIGatewayEvent) {
        //  validate authorize user (if is seller only he can add product)
        const token = event.headers.Authorization;
        const user = await VerifyToken(token);
        if (!user) {
            return ErrorResponse(403, 'authorizatoin failed');
        }

        if (user.user_type.toUpperCase() as UserType !== 'SELLER') {
            return ErrorResponse(
                403,
                'you need to join the seller program to manage product'
            );
        }

        const input = plainToClass(ProductInput, event.body);
        const error = await AppValidationError(input);
        if (error) {
            return ErrorResponse(404, error);
        }

        const data = await this.repository.createProduct({
            ...input,
            seller_id: user.user_id,
        });

        await new CategoryRepository()
            .addItem({
                id: input.category_id,
                products: [ (data._id as string) ],
            })
        return SuccessResponse(data);
    }

    async getProducts() {
        const data = await this.repository.getAllProducts();
        return SuccessResponse(data);
    }

    async getSellerProducts(event: APIGatewayEvent) {
        //  validate authorize user (if is seller only he can edit product)
        const token = event.headers.Authorization;
        const user = await VerifyToken(token);
        if (!user) {
            return ErrorResponse(403, 'authorizatoin failed');
        }

        if (user.user_type.toUpperCase() as UserType !== 'SELLER') {
            return ErrorResponse(
                403,
                'you need to join the seller program to manage product'
            );
        }
        const data = await this.repository.getAllSellerProducts(user.user_id);
        return SuccessResponse(data);
    }

    async getProduct(event: APIGatewayEvent) {
        const productId = event.pathParameters?.id;
        if (!productId) return ErrorResponse(403, 'provide product id');

        const data = await this.repository.getProductById(productId);

        if (data) {
            return SuccessResponse(data);
        }
        return ErrorResponse(404, 'product not found');
    }

    async editProduct(event: APIGatewayEvent) {
        const productId = event.pathParameters?.id;
        if (!productId) return ErrorResponse(403, 'provide product id');

        //  validate authorize user (if is seller only he can edit product)
        const token = event.headers.Authorization;
        const user = await VerifyToken(token);
        if (!user) {
            return ErrorResponse(403, 'authorizatoin failed');
        }

        if (user.user_type.toUpperCase() as UserType !== 'SELLER') {
            return ErrorResponse(
                403,
                'you need to join the seller program to manage product'
            );
        }

        const input = plainToClass(ProductInput, event.body);
        const error = await AppValidationError(input);
        if (error) {
            return ErrorResponse(404, error);
        }

        const isAuthorized = await this.authorizedUser(user.user_id, productId);

        if (!isAuthorized) {
            return ErrorResponse(403, 'you are not authorized to edit this product');
        }

        input.id = productId;
        const data = await this.repository.updateProduct(input);
        return SuccessResponse(data);
    }

    async deleteProduct(event: APIGatewayEvent) {
        const productId = event.pathParameters?.id;
        if (!productId) return ErrorResponse(403, 'provide product id');

        //  validate authorize user (if is seller only he can delete product)
        const token = event.headers.Authorization;
        const user = await VerifyToken(token);
        if (!user) {
            return ErrorResponse(403, 'authorizatoin failed');
        }

        if (user.user_type.toUpperCase() as UserType !== 'SELLER') {
            return ErrorResponse(
                403,
                'you need to join the seller program to manage product'
            );
        }

        const isAuthorized = await this.authorizedUser(user.user_id, productId);

        if (!isAuthorized) {
            return ErrorResponse(403, 'you are not authorized to delete this product');
        }

        const { category_id, deleteResult} = await this.repository.deleteProduct(productId);
        await new CategoryRepository()
        .removeItem({
            id: category_id,
            products: [ (productId as string) ],
        })
        return SuccessResponse(deleteResult);
    }

    // http calls // later convert to RPC & Queue
    async handleQueueOperation(event: APIGatewayEvent) {
        const input = plainToClass(ServiceInput, event.body);
        const error = await AppValidationError(input);
        if (error) {
            return ErrorResponse(404, error);
        }

        // get product info from repository
        const data = await this.repository.getProductById(input.productId);

        if (data) {
            const { _id, name, price, image_url } = data;
            return SuccessResponse({
                product_id: _id,
                name,
                price,
                image_url
            });
        }
        return ErrorResponse(404, 'Product not found');
    }
}