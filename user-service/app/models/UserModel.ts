export interface UserModel {
    user_id?: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    user_type: 'BUYER' | 'SELLER';
}