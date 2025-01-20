import { Client } from 'pg';

export const DBClient = () => {
    const client = new Client({
        host: '',
        user: 'transaction_service',
        database: 'transaction_service',
        password: '***REMOVED***',
        port: 5432,
    });

    return client;
}