import { DBCLient } from "../utils/database";
import { UserModel } from "../models/UserModel";

export class UserRepository {
    constructor() {}

    async createAccount({ phone, email, password, salt, user_type }: UserModel) {
        const client = DBCLient();
        await client.connect();

        const queryString = 'INSERT INTO users(phone, email, password, salt, user_type) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [phone, email, password, salt, user_type];
        const result = await client.query(queryString, values);
        await client.end();

        if (result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
    }

    async findAccount(email: string) {
        const client = DBCLient();
        await client.connect();

        const queryString = 'SELECT user_id, email, password, phone, salt FROM users WHERE email = $1';
        const values = [email];
        const result = await client.query(queryString, values);
        await client.end();

        if (result.rowCount < 1) {
            throw new Error('user with provided email doesnt exist');
        }
        return result.rows[0] as UserModel;
    }
}