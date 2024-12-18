import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ProductService } from "./service/product-service";
import { ProductRepository } from "./repository/product-repository";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import './utils/index';


const productSerivce = new ProductService(new ProductRepository());

const lambdaHandler = (
    event: APIGatewayEvent,
    context: Context,
): Promise<APIGatewayProxyResult> => {
    const isRoot = event.pathParameters === null;
    // /product -> root
    // pathParameters: null

    // /product/1234
    // pathParameters: { id: 1234 }

    switch(event.httpMethod.toLowerCase()) {
        case 'post':
            if (isRoot) {
                // call create product from product service
                return productSerivce.createProduct(event);
            }
            break;
        case 'get':
            // return isRoot ? 'return get products' : 'call get product by id';
            return isRoot ? productSerivce.getProducts() : productSerivce.getProduct(event);
        case 'put':
            if (!isRoot) {
                // call edit product
                return productSerivce.editProduct(event);
            }
            break;
        case 'delete':
            if (!isRoot) {
                // delete product
                return productSerivce.deleteProduct(event);
            }
    }
    return productSerivce.ResponseWithError(event);
};

export const handler = middy()
.use(jsonBodyParser())
.handler(lambdaHandler);