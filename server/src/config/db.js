import mongoose from "mongoose";

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
const connectDB = async () => {
    // If connection already exists, reuse it
    if (cached.conn) {
        console.log("Reusing existing MongoDB connection");
        return cached.conn;
    }

    // If no connection yet, create one
    if (!cached.promise) {
        const MONGODB_URI = `${process.env.MONGODB_URL}/${process.env.DB_NAME}`;

        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,           // ❌ don't buffer — fail fast
            serverSelectionTimeoutMS: 5000,  // timeout after 5s not 10s
        });

        console.log(`MONGODB connecting to: ${MONGODB_URI}`);
    }

    try {
        cached.conn = await cached.promise;
        console.log(`MONGODB connected || DB HOST : ${cached.conn.connection.host}`);
        return cached.conn;
    } catch (error) {
        cached.promise = null;               // ✅ reset so next call retries
        console.log("MongoDB connection error: ", error);
        throw error;                         // ✅ throw instead of process.exit(1)
    }
}

export default connectDB;