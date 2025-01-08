import { UserService } from "../service/userService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { UserRepository } from "../repository/userRepository";

const userService = new UserService(new UserRepository());

export const Signup = middy((event: APIGatewayProxyEventV2) => {
    return userService.CreateUser(event);
}).use(jsonBodyParser());

export const Login =  middy((event: APIGatewayProxyEventV2) => {
    return userService.LoginUser(event);
}).use(jsonBodyParser());

export const Verify =  middy((event: APIGatewayProxyEventV2) => {
    return userService.VerifyUser(event);
}).use(jsonBodyParser());

export const GetVerificationCode = middy((event: APIGatewayProxyEventV2) => {
    return userService.GetVerificationCode(event);
}).use(jsonBodyParser());

export const CreateProfile =  middy((event: APIGatewayProxyEventV2) => {
    return userService.CreateProfile(event);
}).use(jsonBodyParser());

export const GetProfile =  middy((event: APIGatewayProxyEventV2) => {
    return userService.GetProfile(event);
}).use(jsonBodyParser());

export const EditProfile =  middy((event: APIGatewayProxyEventV2) => {
    return userService.EditProfile(event);
}).use(jsonBodyParser());