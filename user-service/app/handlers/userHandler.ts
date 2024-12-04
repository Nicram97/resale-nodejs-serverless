import { ErrorResponse } from "../utils/response";
import { UserService } from "../service/userService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { container } from "tsyringe";

const userService = container.resolve(UserService);

export const Signup = middy((event: APIGatewayProxyEventV2) => {
    return userService.CreateUser(event);
}).use(jsonBodyParser());

export const Login = async (event: APIGatewayProxyEventV2) => {
    return userService.LoginUser(event);
}

export const Veryify = async (event: APIGatewayProxyEventV2) => {
   return userService.VerifyUser(event);
}

export const Profile = async (event: APIGatewayProxyEventV2) => {
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
}

export const Cart = async (event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();

    switch (httpMethod) {
        case 'post':
            return userService.CreateCart(event);
        case 'get':
            return userService.GetCart(event);
        case 'put':
            return userService.EditCart(event);
        default:
            return ErrorResponse(404, 'request method not supported');
    }
}

export const Payment = async (event: APIGatewayProxyEventV2) => {
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
}