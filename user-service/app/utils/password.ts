import { UserModel } from '../models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// just for now for dev
const APP_SECRET = 'our_app_secret';

export const GetSalt = () => {
    return bcrypt.genSalt();
};

export const GetHashedPassword = async (password: string, salt: string) => {
    return bcrypt.hash(password, salt);
};

export const ValidatePassword = async (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
};

export const GenerateToken = ({ email, user_id, phone, user_type}: UserModel) => {
    return jwt.sign({
        user_id,
        email,
        phone,
        user_type
    }, 
    APP_SECRET,
    {
        expiresIn: '30d'
    });
}

export const VerifyToken = async (token: string): Promise<UserModel | false> => {
    try {
        if (token) {
            const payload = jwt.verify(token.split(' ')[1], APP_SECRET);
            return payload as UserModel;
        }
        return false;
    } catch(e) {
        return false;
    }
}