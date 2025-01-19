import * as jwt from "jsonwebtoken";

// just for now for dev
const APP_SECRET = 'our_app_secret';

export type UserType = 'BUYER' | 'SELLER';

export type AuthPayload = {
    user_id: number;
    email: string;
    user_type: UserType;
}

export const VerifyToken = async (token?: string) => {
    try {
        if (token) {
            const payload = jwt.verify(token.split(' ')[1], APP_SECRET);
            return payload as AuthPayload;
        }
        return false;
    } catch(e) {
        return false;
    }
}