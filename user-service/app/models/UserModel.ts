export interface UserModel {
    user_id?: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    user_type: 'BUYER' | 'SELLER';
    first_name?: string;
    last_name?: string;
    profile_pic?: string;
    verification_code?: number;
    code_expiry?: string;
}