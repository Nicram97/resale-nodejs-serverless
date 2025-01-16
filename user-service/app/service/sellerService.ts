import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SellerRepository } from "../repository/sellerRepository";
import { GenerateToken, VerifyToken } from "../utils/password";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { plainToClass } from "class-transformer";
import { PaymentMethodInput, SellerProgramInput } from "../models/dto/JoinSellerProgramInput";
import { AppValidationError } from "../utils/errors";

export class SellerService {
    repository: SellerRepository

    constructor(repository: SellerRepository) {
        this.repository = repository;
    }

    async JoinSelleProgram(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);

        if (!payload) return ErrorResponse(403, 'authorization failed');

        const input = plainToClass(SellerProgramInput, event.body);
        const error = await AppValidationError(input);

        if (error) {
            return ErrorResponse(400, error);
        }

        const { firstName, lastName, phoneNumber, address } = input;

        const isEnrolled = await this.repository.checkEnrolledProgram(payload.user_id);

        if (isEnrolled) {
            return ErrorResponse(403, 'You are already enroled');
        }

        // update user account
        const updatedUser = await this.repository.updateProfile({
            firstName,
            lastName,
            phoneNumber,
            user_id: payload.user_id,
        });

        console.log('USER ID', payload.user_id);
        // update address
        await this.repository.updateAddress({
            ...address,
            user_id: payload.user_id,
        });

        // create payment method
        const result = await this.repository.createPaymentMethod({
            ...input,
            user_id: payload.user_id,
        });
        
        // signed token
        if (updatedUser && result) {
            const token = GenerateToken(updatedUser);
            return SuccessResponse({
                message: 'successfully joined seller program',
                seller: {
                    token,
                    email: updatedUser.email,
                    firstName: updatedUser.first_name,
                    lastName: updatedUser.last_name,
                    phone: updatedUser.phone,
                    userType: updatedUser.user_type,
                    _id: updatedUser.user_id,
                },
            });
        } else {
            return ErrorResponse(500, 'error on joining seller program!');
        }
    }

    async GetPaymentMethods(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);

        if (!payload) return ErrorResponse(403, 'authorization failed');
        
        const paymentMethods = await this.repository.getPaymentMethods(payload.user_id);

        return SuccessResponse({ paymentMethods });
    }

    async EditPaymentMethod(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);

        if (!payload) return ErrorResponse(403, 'authorization failed');

        const input = plainToClass(PaymentMethodInput, event.body);
        const error = await AppValidationError(input);

        if (error) {
            return ErrorResponse(400, error);
        }

        const payment_id = Number(event.pathParameters.id);

        const result = await this.repository.updatePaymentMethod({
            ...input,
            payment_id,
            user_id: payload.user_id,
        });

        if (result) {
            return SuccessResponse({
                message: 'payment method updated'
            });
        } else {
            return ErrorResponse(500, 'error on editing payment method');
        }
    }
}