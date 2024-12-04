import { UserRepository } from "../repository/userRepository";
import { SuccessResponse } from "../utils/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserService {
    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    // User Creation, Validatoin & Login
    async CreateUser(event: APIGatewayProxyEventV2) {
        await this.userRepository.CreateUserOperation();
        return SuccessResponse({
            message: 'response from Create User',
        });
    }

    async LoginUser(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Login User',
        });
    }

    async VerifyUser(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Verify User',
        });
    }

    // User Profile
    async CreateProfile(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Create Profile',
        });
    }

    async GetProfile(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Get Profile',
        });
    }

    async EditProfile(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Edit Profile',
        });
    }

    // Cart section
    async CreateCart(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Create Cart',
        });
    }

    async GetCart(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Get Cart',
        });
    }

    async EditCart(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Edit Cart',
        });
    }

    // Payment section
    async CreatePaymentMethod(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Create Payment',
        });
    }

    async GetPaymentMethod(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Get Payment',
        });
    }

    async EditPaymentMethod(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Edit Payment',
        });
    }
}