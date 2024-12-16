import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CategoryService } from "./service/category-service";
import { CategoryRepository } from "./repository/category-repository";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";

const categoryService = new CategoryService(new CategoryRepository());

const lambdaHandler = (
    event: APIGatewayEvent,
    context: Context,
): Promise<APIGatewayProxyResult> => {
    const isRoot = event.pathParameters === null;

    switch(event.httpMethod.toLowerCase()) {
        case 'post':
            if (isRoot) {
                return categoryService.createCategory(event);
            }
            break;
        case 'get':
            return isRoot ? categoryService.getCategories(event) : categoryService.getCategory(event);
        case 'put':
            if (!isRoot) {
                return categoryService.editCategory(event);
            }
            break;
        case 'delete':
            if (!isRoot) {
                return categoryService.deleteCategory(event);
            }
    }
    return categoryService.ResponseWithError(event);
}

export const handler = middy()
.use(jsonBodyParser())
.handler(lambdaHandler);