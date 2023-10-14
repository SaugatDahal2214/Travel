import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import ENV from '../config.js';

async function connect() {
    const mongod = await MongoMemoryServer.create();
    const getUri = mongod.getUri();

    mongoose.set('strictQuery', true);

    try {
        const db = await mongoose.connect(ENV.MONGO_URI, {
            useUnifiedTopology: true,
            family: 4,
        });
        console.log("Database Connected");
        return db;
    } catch (error) {
        console.error("Database Connection Error:", error);
        throw error; // Rethrow the error to handle it elsewhere, if needed.
    }
}

export default connect;
