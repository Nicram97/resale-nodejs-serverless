import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { SellerService } from "../service/sellerService";
import { SellerRepository } from "../repository/sellerRepository";

const sellerService = new SellerService(new SellerRepository());

export const JoinSellerProgram = middy((event: APIGatewayProxyEventV2) => {
    return sellerService.JoinSelleProgram(event);
}).use(jsonBodyParser());

export const GetPaymentMethods = middy((event: APIGatewayProxyEventV2) => {
    return sellerService.GetPaymentMethods(event);
}).use(jsonBodyParser());

export const EditPaymentMethod = middy((event: APIGatewayProxyEventV2) => {
    return sellerService.EditPaymentMethod(event);
}).use(jsonBodyParser());