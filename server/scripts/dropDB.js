import mongoose from "mongoose";
import "dotenv/config";

const dropDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined");
        process.exit(1);
    }

    try {
        // First, connect to QuickShow and drop it
        console.log("Connecting to [QuickShow] database...");
        await mongoose.connect(`${process.env.MONGODB_URI}/QuickShow`);
        await mongoose.connection.db.dropDatabase();
        console.log("Database [QuickShow] dropped successfully.");
        await mongoose.connection.close();

        // Then, connect to quickshow and drop it (if it exists)
        console.log("Connecting to [quickshow] database...");
        await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`);
        await mongoose.connection.db.dropDatabase();
        console.log("Database [quickshow] dropped successfully.");
        await mongoose.connection.close();

        console.log("Cleanup complete. You can now start the server fresh.");
        process.exit(0);
    } catch (error) {
        console.error("Error dropping database:", error.message);
        process.exit(1);
    }
};

dropDB();
