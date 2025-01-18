import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ProductService } from "../service/product-service";
import { ProductRepository } from "../repository/product-repository";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import '../utils/index';


const productSerivce = new ProductService(new ProductRepository());

export const messageQueueHandler = middy(
    (
        event: APIGatewayEvent,
        context: Context,
    ): Promise<APIGatewayProxyResult> => {
        return productSerivce.handleQueueOperation(event);
    }
).use(jsonBodyParser());