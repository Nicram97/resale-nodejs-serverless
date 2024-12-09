import { DBCLient } from "../utils/database";
import { UserModel } from "../models/UserModel";
import { DBOperation } from "./dbOperation";
import { ProfileInput } from "../models/dto/ProfileInput";
import { UserAddressModel } from "../models/UserAddressModel";

export class UserRepository extends DBOperation{
    constructor() {
        super();
    }

    async createAccount({ phone, email, password, salt, user_type }: UserModel) {
        const queryString = 'INSERT INTO users(phone, email, password, salt, user_type) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [phone, email, password, salt, user_type];
        const result = await this.executeQuery(queryString, values);

        if (result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
    }

    async findAccount(email: string) {
        const queryString = 'SELECT user_id, email, password, phone, salt, verification_code, code_expiry FROM users WHERE email = $1';
        const values = [email];
        const result = await this.executeQuery(queryString, values);

        if (result.rowCount < 1) {
            throw new Error('user with provided email doesnt exist');
        }
        return result.rows[0] as UserModel;
    }

    async updateVerificationCode(userId: number, code: number, codeExpiry: Date) {
        const queryString = 'UPDATE users SET verification_code=$1, code_expiry=$2 WHERE user_id=$3 AND verified=FALSE RETURNING *';
        const values = [code, codeExpiry, userId];
        const result = await this.executeQuery(queryString, values);

        if (result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
        throw new Error('user alredy verified');
    }

    async updateVerifyUser(userId: number) {
        const queryString = 'UPDATE users SET verified=TRUE WHERE user_id=$1 AND verified=FALSE RETURNING *';
        const values = [userId];
        const result = await this.executeQuery(queryString, values);

        if (result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
        throw new Error('user alredy verified');
    }

    async updateUser(userId: number, firstName: string, lastName: string, userType: string) {
        const queryString = 'UPDATE users SET first_name=$1, last_name=$2, user_type=$3 WHERE user_id=$4 RETURNING *';
        const values = [firstName, lastName, userType, userId];
        const result = await this.executeQuery(queryString, values);

        if (result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
        throw new Error('error while updating user');
    }

    async createProfile(
        userId: number,
        {
            firstName,
            lastName,
            userType,
            address: {
                addressLine1,
                addressLine2,
                city,
                postCode,
                country
            }
        }: ProfileInput) {
        
        await this.updateUser(
            userId,
            firstName,
            lastName,
            userType,
        );

        const queryString = 'INSERT INTO user_address(user_id, address_line_1, address_line_2, city, post_code, country) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [userId, addressLine1, addressLine2, city, postCode, country];
        const result = await this.executeQuery(queryString, values);

        if (result.rowCount > 0) {
            return result.rows[0] as UserAddressModel;
        }

        throw new Error('error while creating profile');
    }

    async getUserProfile(userId: number) {
        const profileQuery = 
            'SELECT first_name, last_name, email, phone, user_type, verified FROM users WHERE user_id=$1';
        const profileQueryValues = [userId];

        const profileResult = await this.executeQuery(profileQuery, profileQueryValues);
        if (profileResult.rowCount < 1) {
            throw new Error('user profile not found');
        }

        const userProfile = profileResult.rows[0] as UserModel;

        const addressQuery = 
            'SELECT id, address_line_1, address_line_2, city, post_code, country FROM user_address WHERE user_id=$1';
        const addressQueryValues = [userId];
        const addressResult = await this.executeQuery(addressQuery, addressQueryValues);
        if (addressResult.rowCount > 0) {
            userProfile.address = addressResult.rows as UserAddressModel[];
        }

        return userProfile;
    }

    async editProfile(
        userId: number,
        {
            firstName,
            lastName,
            userType,
            address: {
                id,
                addressLine1,
                addressLine2,
                city,
                postCode,
                country
            }
        }: ProfileInput) {
        
        await this.updateUser(
            userId,
            firstName,
            lastName,
            userType,
        );

        const queryString = 
            'UPDATE user_address SET address_line_1=$1, address_line_2=$2, city=$3, post_code=$4, country=$5 WHERE id=$6';
        const values = [addressLine1, addressLine2, city, postCode, country, id];
        const result = await this.executeQuery(queryString, values);

        if (result.rowCount > 0) {
            return result.rows[0] as UserAddressModel;
        }

        throw new Error('error while updating profile');
    }
}