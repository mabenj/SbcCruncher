import mongoose from "mongoose";
import { Log } from "./log";

const CONN_STRING = process.env.MONGO_CONN_STRING;

export async function connect() {
    Log.info("Connecting to database...");
    try {
        if (!CONN_STRING) {
            throw new Error("Connection string missing");
        }
        await mongoose.connect(CONN_STRING);
        Log.info("Connected");
    } catch (err) {
        Log.error("Error connecting to database", err);
    }
}

export async function disconnect() {
    Log.info("Disonnecting from database...");
    try {
        await mongoose.disconnect();
        Log.info("Disonnected");
    } catch (err) {
        Log.error("Error disconnecting from database", err);
    }
}
