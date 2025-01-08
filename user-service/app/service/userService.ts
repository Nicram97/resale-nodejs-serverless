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
import { VerificationInput } from "../models/dto/VerificationInput";
import { TimeDifference } from "../utils/dateHelper";
import { ProfileInput } from "../models/dto/ProfileInput";

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
            const isValid = await ValidatePassword(input.password, foundUser.password);

            if (!isValid) {
                throw new Error('credentails doesnt match');
            }
            const token = GenerateToken(foundUser);
            return SuccessResponse({ token });
        } catch(e) {
            return ErrorResponse(500, e);
        }
    }

    async GetVerificationCode(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);

        if (!payload) return ErrorResponse(403, 'authorization failed');

        const { code, expiry } = GenerateVerificationCode();
        // save in db
        await this.userRepository.updateVerificationCode(payload.user_id, code, expiry);
        console.log(code, expiry);

        // const response = await SendVerificationCode(code, payload.phone);
        return SuccessResponse({
            message: 'verification code has been send to Your registered mobile number',
        });
    }

    async VerifyUser(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);

        if (!payload) return ErrorResponse(403, 'authorization failed');

        const input = plainToClass(VerificationInput, event.body);
        const error = await AppValidationError(input);
        if (error) {
            return ErrorResponse(404, error);
        }

        // find user account
        const { verification_code, code_expiry } = await this.userRepository.findAccount(payload.email);

        // check code if matches for this user and if isnt expired
        if (verification_code === input.code) {
            // check expiry
            const currentTime = new Date();
            const diff = TimeDifference(code_expiry, currentTime.toISOString(), 'm');

            if (diff > 0) {
                // update DB
                console.log('verified successfully');
                await this.userRepository.updateVerifyUser(payload.user_id);
                return SuccessResponse({
                    message: 'user verified',
                });
            }
            return ErrorResponse(403, 'verification code is expired');
        }
        return ErrorResponse(400, 'invalid OTP');
    }

    // User Profile
    async CreateProfile(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);
        if (!payload) return ErrorResponse(403, 'authorization failed');

        const input = plainToClass(ProfileInput, event.body);
        const error = await AppValidationError(input);
        if (error) {
            return ErrorResponse(404, error);
        }

        try {
            await this.userRepository.createProfile(payload.user_id, input);

            return SuccessResponse({
                message: 'response from Create Profile',
            });
        } catch(e) {
            return ErrorResponse(500, e);
        }
    }

    async GetProfile(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);
        if (!payload) return ErrorResponse(403, 'authorization failed');

        try {
            const result = await this.userRepository.getUserProfile(payload.user_id);
            return SuccessResponse(result);
        } catch(e) {
            return ErrorResponse(500, e);
        }
    }

    async EditProfile(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);
        if (!payload) return ErrorResponse(403, 'authorization failed');

        const input = plainToClass(ProfileInput, event.body);
        const error = await AppValidationError(input);
        if (error) {
            return ErrorResponse(404, error);
        }

        try {
            await this.userRepository.editProfile(payload.user_id, input);
            return SuccessResponse({
                message: 'Profile updated',
            });
        } catch(e) {
            return ErrorResponse(500, e);
        }
    }

    // Payment section
    async CreatePayment(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Create Payment',
        });
    }

    async GetPayment(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Get Payment',
        });
    }

    async EditPayment(event: APIGatewayProxyEventV2) {
        return SuccessResponse({
            message: 'response from Edit Payment',
        });
    }
}