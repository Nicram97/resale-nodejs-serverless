import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ProductService } from "../service/product-service";
import { ProductRepository } from "../repository/product-repository";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import '../utils/index';


const productSerivce = new ProductService(new ProductRepository());

export const createProduct = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return productSerivce.createProduct(event);
    }
).use(jsonBodyParser());

export const getProduct = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return productSerivce.getProduct(event);
    }
).use(jsonBodyParser());

export const getProducts = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return productSerivce.getProducts();
    }
).use(jsonBodyParser());

export const getSellerProducts = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return productSerivce.getProducts();
    }
).use(jsonBodyParser());

export const editProduct = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return productSerivce.editProduct(event);
    }
).use(jsonBodyParser());

export const deleteProduct = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return productSerivce.deleteProduct(event);
    }
).use(jsonBodyParser());
