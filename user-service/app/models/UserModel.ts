import { UserAddressModel } from "./UserAddressModel";

export interface UserModel {
    user_id?: number;
    phone: string;
    email: string;
    password: string;
    salt: string;
    user_type: UserType;
    first_name?: string;
    last_name?: string;
    profile_pic?: string;
    verification_code?: number;
    code_expiry?: string;
    address?: UserAddressModel[];
    stripe_id?: string;
    payment_id?: string;
}

export type UserType = 'BUYER' | 'SELLER';