import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SellerRepository } from "../repository/sellerRepository";

export class SellerService {
    repository: SellerRepository

    constructor(repository: SellerRepository) {
        this.repository = repository;
    }

    async JoinSelleProgram(event: APIGatewayProxyEventV2) {

    }

    async GetPaymentMethods(event: APIGatewayProxyEventV2) {
        
    }

    async EditPaymentMethod(event: APIGatewayProxyEventV2) {
        
    }
}