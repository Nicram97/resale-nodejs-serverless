import mongoose from "mongoose";

// // strictQuery -> if You pass more data than model describes do not error out
mongoose.set('strictQuery', false);

export default async (): Promise<mongoose.Mongoose> => {
    // if You are using docker mongodb instead of localhost use host.docker.internal + AWS SAM
    const DB_URL = 'mongodb+srv://example:example@cluster0.u4e6z.mongodb.net/resale-nodejs-serverless' // 'mongodb://host.docker.internal:27017/resale-nodejs-serverless';
    try {
        const connection = await mongoose.connect(DB_URL, {
            autoIndex: true,
        });
        console.log('connected to Db', DB_URL);
        return connection;
    } catch (e) {
        console.error(e);
        throw e;
    }
}