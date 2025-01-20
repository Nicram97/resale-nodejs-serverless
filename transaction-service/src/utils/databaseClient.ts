import { Client } from 'pg';

export const DBClient = () => {
    const client = new Client({
        host: '',
        user: '',
        database: '',
        password: '',
        port: 5432,
    });

    return client;
}