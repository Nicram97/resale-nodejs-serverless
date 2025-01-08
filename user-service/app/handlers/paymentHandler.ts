import { container } from "tsyringe";
import { UserService } from "../service/userService";
import middy from "@middy/core";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import jsonBodyParser from "@middy/http-json-body-parser";

const userService = container.resolve(UserService);

export const CreatPayment = middy((event: APIGatewayProxyEventV2) => {
    return userService.CreatePayment(event);
}).use(jsonBodyParser());

export const GetPayment = middy((event: APIGatewayProxyEventV2) => {
    return userService.GetPayment(event);
}).use(jsonBodyParser());

export const EditPayment = middy((event: APIGatewayProxyEventV2) => {
    return userService.EditPayment(event);
}).use(jsonBodyParser());