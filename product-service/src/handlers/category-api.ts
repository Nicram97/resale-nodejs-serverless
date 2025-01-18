import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CategoryService } from "../service/category-service";
import { CategoryRepository } from "../repository/category-repository";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import '../utils/index';

const categoryService = new CategoryService(new CategoryRepository());

export const createCategory = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return categoryService.createCategory(event);
    }
).use(jsonBodyParser());

export const getCategory = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return categoryService.getCategory(event);
    }
).use(jsonBodyParser());

export const getCategories = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return categoryService.getCategories(event);
    }
).use(jsonBodyParser());

export const editCategory = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return categoryService.editCategory(event);
    }
).use(jsonBodyParser());

export const deleteCategory = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return categoryService.deleteCategory(event);
    }
).use(jsonBodyParser());