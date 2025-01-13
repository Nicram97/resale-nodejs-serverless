import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayEvent, Context } from "aws-lambda";
import { DBOperation } from "./db-operation";


const dbOperation = new DBOperation();

export const getOrdersHandler = middy(
    async (event: APIGatewayEvent, context: Context) => {
        const queryString = 'SELECT * FROM orders LIMIT 500';
        const result = await dbOperation.executeQuery(queryString, []);

        if (result.rowCount !== null && result.rowCount > 0) {
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                statusCode: 201,
                body: JSON.stringify({ orders: result.rows[0] }),
            };
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'orders not found' }),
        };
    }
).use(jsonBodyParser());

export const getOrderHandler = middy(
    async (event: APIGatewayEvent, context: Context) => {
        const { id } = event.pathParameters as any;
        const queryString = 'SELECT * FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE user_id=$1';
        const result = await dbOperation.executeQuery(queryString, [id]);

        if (result.rowCount !== null && result.rowCount > 0) {
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                statusCode: 201,
                body: JSON.stringify({ orders: result.rows[0] }),
            };
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'order not found' }),
        };
    }
).use(jsonBodyParser());