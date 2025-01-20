import { Client } from "pg";

export const DBCLient = () => {
    // if db run from docker compose
    // return new Client({
    //     host: '127.0.0.1',
    //     user: '***REMOVED***',
    //     database: 'user_service',
    //     password: '***REMOVED***',
    //     port: 5432
    // });
    return new Client({
        host: '', 
        user: 'user_service',
        database: 'user_service',
        password: '***REMOVED***',
        port: 5432
    });
}