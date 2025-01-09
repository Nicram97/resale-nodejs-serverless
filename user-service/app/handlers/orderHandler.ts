import { CartService } from "../service/cartService";
import middy from "@middy/core";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import jsonBodyParser from "@middy/http-json-body-parser";
import { CartRepository } from "../repository/cartRepository";

const cartService = new CartService(new CartRepository());

export const CollectPayment = middy((event: APIGatewayProxyEventV2) => {
    return cartService.CollectPayment(event);
}).use(jsonBodyParser());

export const PlaceOrder = middy((event: APIGatewayProxyEventV2) => {
    return cartService.PlaceOrder(event);
}).use(jsonBodyParser());
