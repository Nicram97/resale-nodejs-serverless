import { APIGatewayEvent } from "aws-lambda";
import { CategoryRepository } from "../repository/category-repository";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utils/errors";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { CategoryInput } from "../dto/category-input";
import '../utils/index';

export class CategoryService {
    repository: CategoryRepository;

    constructor(repository: CategoryRepository) {
        this.repository = repository;
    }

    async ResponseWithError(event: APIGatewayEvent) {
        return ErrorResponse(404, new Error('method not allowed!'));
    }
    
    async createCategory(event: APIGatewayEvent) {
        const input = plainToClass(CategoryInput, event.body);
        console.log('eko', input);
        const error = await AppValidationError(input);
        console.log('error', error);
        if (error) {
            return ErrorResponse(404, error);
        }

        const data = await this.repository.createCategory(input);
        return SuccessResponse(data);
    }

    async getCategories(event: APIGatewayEvent) {
        const type = event.queryStringParameters?.type;

        if (type === 'top') {
            const data = await this.repository.getTopCategories();
            return SuccessResponse(data);
        }
        const data = await this.repository.getAllCategories();
        return SuccessResponse(data);
    }

    async getCategory(event: APIGatewayEvent) {
        const categoryId = event.pathParameters?.id;
        const offset = Number(event.queryStringParameters?.offset)
        const perPage = Number(event.queryStringParameters?.perPage)
        if (!categoryId) return ErrorResponse(403, 'provide category id');

        const data = await this.repository.getCategoryById(categoryId, offset, perPage);

        if (data) {
            return SuccessResponse(data);
        }
        return ErrorResponse(404, 'category not found');
    }

    async editCategory(event: APIGatewayEvent) {
        const categoryId = event.pathParameters?.id;
        if (!categoryId) return ErrorResponse(403, 'provide category id');

        const input = plainToClass(CategoryInput, event.body);
        const error = await AppValidationError(input);
        if (error) {
            return ErrorResponse(404, error);
        }
        input.id = categoryId;

        const data = await this.repository.updateCategory(input);
        return SuccessResponse(data);
    }

    async deleteCategory(event: APIGatewayEvent) {
        const categoryId = event.pathParameters?.id;
        if (!categoryId) return ErrorResponse(403, 'provide category id');

        const data = await this.repository.deleteCategory(categoryId);
        return SuccessResponse(data);
    }
}