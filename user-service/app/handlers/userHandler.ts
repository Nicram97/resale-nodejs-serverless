import { ErrorResponse } from "../utils/response";
import { UserService } from "../service/userService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { container } from "tsyringe";
import { CartService } from "../service/cartService";

const userService = container.resolve(UserService);
const cartService = container.resolve(CartService);

export const Signup = middy((event: APIGatewayProxyEventV2) => {
    return userService.CreateUser(event);
}).use(jsonBodyParser());

export const Login =  middy((event: APIGatewayProxyEventV2) => {
    return userService.LoginUser(event);
}).use(jsonBodyParser());

export const Verify =  middy((event: APIGatewayProxyEventV2) => {
   const httpMethod = event.requestContext.http.method.toLowerCase();

   switch (httpMethod) {
       case 'post':
            return userService.VerifyUser(event);
       case 'get':
            return userService.GetVerificationToken(event);
       default:
            return ErrorResponse(404, 'request method not supported');
   }
}).use(jsonBodyParser());

export const Profile =  middy((event: APIGatewayProxyEventV2) => {
    // post / put / get
    const httpMethod = event.requestContext.http.method.toLowerCase();

    switch (httpMethod) {
        case 'post':
            return userService.CreateProfile(event);
        case 'get':
            return userService.GetProfile(event);
        case 'put':
            return userService.EditProfile(event);
        default:
            return ErrorResponse(404, 'request method not supported');
    }
}).use(jsonBodyParser());

export const Cart = middy((event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();

    switch (httpMethod) {
        case 'post':
            return cartService.CreateCart(event);
        case 'get':
            return cartService.GetCart(event);
        case 'put':
            return cartService.EditCart(event);
        case 'delete':
            return cartService.DeleteCart(event);
        default:
            return ErrorResponse(404, 'request method not supported');
    }
}).use(jsonBodyParser());

export const CollectPayment = middy((event: APIGatewayProxyEventV2) => {
    return cartService.CollectPayment(event);
}).use(jsonBodyParser());

export const Payment = middy((event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();

    switch (httpMethod) {
        case 'post':
            return userService.CreatePaymentMethod(event);
        case 'get':
            return userService.GetPaymentMethod(event);
        case 'put':
            return userService.EditPaymentMethod(event);
        default:
            return ErrorResponse(404, 'request method not supported');
    }
}).use(jsonBodyParser());