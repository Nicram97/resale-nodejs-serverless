import { plainToClass } from "class-transformer";
import { UserRepository } from "../repository/userRepository";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { SignupInput } from "../models/dto/SignupInput";
import { AppValidationError } from "../utils/errors";
import { GenerateToken, GetHashedPassword, GetSalt, ValidatePassword, VerifyToken } from "../utils/password";
import { LoginInput } from "../models/dto/LoginInput";
import { GenerateVerificationCode, SendVerificationCode } from "../utils/notification";

@autoInjectable()
export class UserService {
    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    // User Creation, Validatoin & Login
    async CreateUser(event: APIGatewayProxyEventV2) {
        try {
            const input = plainToClass(SignupInput, event.body);
            const error = await AppValidationError(input);
            if (error) {
                return ErrorResponse(404, error);
            }

            const salt = await GetSalt();
            const hashedPassword = await GetHashedPassword(input.password, salt);
            const user = await this.userRepository.createAccount({
                phone: input.phone,
                email: input.email,
                password: hashedPassword,
                salt,
                user_type: 'BUYER'
            })

            return SuccessResponse(user);
        } catch(e) {
            return ErrorResponse(500, e);
        }
    }

    async LoginUser(event: APIGatewayProxyEventV2) {
        try {
            const input = plainToClass(LoginInput, event.body);
            const error = await AppValidationError(input);
            if (error) {
                return ErrorResponse(404, error);
            }

            const foundUser = await this.userRepository.findAccount(input.email);
            const verified = await ValidatePassword(input.password, foundUser.password);

            if (!verified) {
                throw new Error('credentails doesnt match');
            }
            const token = GenerateToken(foundUser);
            return SuccessResponse({ token });
        } catch(e) {
            return ErrorResponse(500, e);
        }
    }

    async GetVerificationToken(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);

        if (payload) {
            const { code, expiry } = GenerateVerificationCode();
            // save in db
            await this.userRepository.updateVerificationCode(payload.user_id, code, expiry);
            console.log(code, expiry);

            // const response = await SendVerificationCode(code, payload.phone);
            return SuccessResponse({
                message: 'verification code has been send to Your registered mobile number',
            });
        }

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