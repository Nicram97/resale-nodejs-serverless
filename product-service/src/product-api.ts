import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ErrorResponse } from "./utils/response";
import { ProductService } from "./service/product-service";
import { ProductRepository } from "./repository/product-repository";
import dbConnection from "./utils/db-connection";

(async () => {
    const connection = await dbConnection();
    console.log('WTF', connection)
})();
const productSerivce = new ProductService(new ProductRepository());

export const handler = async (
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
            return isRoot ? productSerivce.getProducts(event) : productSerivce.getProduct(event);
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
    return ErrorResponse(404, 'request method not allowed');
};