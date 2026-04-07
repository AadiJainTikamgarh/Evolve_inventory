import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { 
        conn: null, 
        promise: null,
        lastActivityTime: null  // ← ADD THIS
    };
}

// ⚠️ CRITICAL: Connection idle timeout (Vercel + MongoDB Atlas issue)
// MongoDB Atlas closes idle connections after ~15 minutes
// We recycle before that to avoid dead connections
const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

/**
 * Check if the cached connection is still healthy
 * Returns true only if connection exists AND is active
 */
const isConnectionHealthy = () => {
    // No connection at all
    if (!cached.conn) {
        return false;
    }

    // Check connection state: 1 = connected, others = not connected
    const readyState = cached.conn.connection.readyState;
    if (readyState !== 1) {
        console.log(`⚠️  Connection state: ${readyState} (not connected) - will reconnect`);
        return false;
    }

    // Check if connection has been idle too long
    const now = Date.now();
    if (cached.lastActivityTime && (now - cached.lastActivityTime) > IDLE_TIMEOUT) {
        console.log(`⏱️  Connection idle for ${Math.round((now - cached.lastActivityTime) / 1000)}s - will reconnect`);
        return false;
    }

    return true;
};

/**
 * Close the cached connection safely
 */
const closeConnection = async () => {
    if (cached.conn) {
        try {
            await cached.conn.connection.close();
            console.log("🔴 Closed stale connection");
        } catch (err) {
            console.error("Error closing connection:", err.message);
        }
    }
};

const connectDB = async () => {
    // ✅ NEW: Check if cached connection is still healthy
    if (isConnectionHealthy()) {
        console.log("✅ Reusing healthy cached MongoDB connection");
        cached.lastActivityTime = Date.now(); // Update last activity time
        return cached.conn;
    }

    // ✅ NEW: If connection exists but is stale, close it
    if (cached.conn && cached.conn.connection.readyState !== 1) {
        console.log("🔄 Closing stale connection...");
        await closeConnection();
        cached.conn = null;
    }

    // If no valid promise yet, create one
    if (!cached.promise) {
        const MONGODB_URI = `${process.env.MONGODB_URL}/${process.env.DB_NAME}`;

        console.log(`🔗 Creating new MongoDB connection to: ${MONGODB_URI}`);

        cached.promise = mongoose.connect(MONGODB_URI, {
            // Connection pool settings - CRITICAL for Vercel
            maxPoolSize: 5,        // ← Keep low for serverless
            minPoolSize: 1,
            
            // Timeout settings
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            
            // Retry settings
            retryWrites: true,
            
            // Force IPv4
            family: 4,
        }).then((conn) => {
            console.log(`✅ MongoDB connected | DB HOST: ${conn.connection.host}`);
            cached.lastActivityTime = Date.now(); // Record connection time
            return conn;
        }).catch((err) => {
            console.error("❌ MongoDB connection error:", err.message);
            cached.promise = null; // Reset promise for retry
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
        cached.lastActivityTime = Date.now(); // Update activity time
        return cached.conn;
    } catch (error) {
        cached.promise = null; // Reset so next call retries
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

export default connectDB;

// ✅ OPTIONAL: Export connection status for debugging
export const getDBStatus = async () => {
    try {
        const conn = await connectDB();
        const idleTime = cached.lastActivityTime ? Date.now() - cached.lastActivityTime : null;
        return {
            connected: conn.connection.readyState === 1,
            host: conn.connection.host,
            healthy: isConnectionHealthy(),
            idleTimeMs: idleTime,
            idleTimeSeconds: idleTime ? Math.round(idleTime / 1000) : null,
            timestamp: new Date().toISOString()
        };
    } catch (err) {
        return {
            connected: false,
            error: err.message,
            timestamp: new Date().toISOString()
        };
    }
};