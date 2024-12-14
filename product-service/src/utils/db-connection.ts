import mongoose from "mongoose";

// // strictQuery -> if You pass more data than model describes do not error out
mongoose.set('strictQuery', false);

export default async (): Promise<mongoose.Mongoose> => {
    // if You are using docker mongodb instead of localhost use host.docker.internal
    const DB_URL = 'mongodb://host.docker.internal:27017/resale-nodejs-serverless';
    try {
        const connection = await mongoose.connect(DB_URL, {
            autoIndex: true,
        });
        return connection
    } catch (e) {
        console.error(e);
        throw e;
    }

}