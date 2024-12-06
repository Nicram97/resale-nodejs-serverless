import { Client } from "pg";

export const DBCLient = () => {
    return new Client({
        host: '127.0.0.1',
        user: '***REMOVED***',
        database: 'user_service',
        password: '***REMOVED***',
        port: 5432
    });
}