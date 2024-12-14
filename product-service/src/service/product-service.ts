import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utils/errors";
import { ProductInput } from "../dto/product-inputs";

export class ProductService {
    repository: ProductRepository;

    constructor(repository: ProductRepository) {
        this.repository = repository;
    }

    async createProduct(event: APIGatewayEvent) {
        const input = plainToClass(ProductInput, JSON.parse(event.body!));
        const error = await AppValidationError(input);
        if (error) {
            return ErrorResponse(404, error);
        }

        const data = await this.repository.createProduct(input);
        return SuccessResponse(data);
    }

    async getProducts() {
        const data = await this.repository.getAllProducts();
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

        const input = plainToClass(ProductInput, JSON.parse(event.body!));
        const error = await AppValidationError(input);
        if (error) {
            return ErrorResponse(404, error);
        }
        input.id = productId;

        const data = await this.repository.updateProduct(input);
        return SuccessResponse(data);
    }

    async deleteProduct(event: APIGatewayEvent) {
        const productId = event.pathParameters?.id;
        if (!productId) return ErrorResponse(403, 'provide product id');

        const data = await this.repository.deleteProduct(productId);
        return SuccessResponse(data);
    }
}