import { Client } from "pg";

export const DBCLient = () => {
    // if db run from docker compose
    // return new Client({
    //     host: '127.0.0.1',
    //     user: 'root',
    //     database: 'user_service',
    //     password: 'root',
    //     port: 5432
    // });
    return new Client({
        host: '', 
        user: '',
        database: '',
        password: '',
        port: 5432
    });
}