import { DBCLient } from "../utils/database";

export class DBOperation {
    constructor() {}

    async executeQuery(queryString: string, values: unknown[]) {
        const client = DBCLient();
        await client.connect();
        const result = await client.query(queryString, values);
        await client.end();

        return result;
    }
}