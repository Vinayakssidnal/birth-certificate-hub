require("dotenv").config();
const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/birthhub";

async function updateVerifyTransactions() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const result = await Transaction.updateMany(
            { action_type: "verify", txHash: null },
            { $set: { txHash: "—" } }
        );

        console.log(`Updated ${result.modifiedCount} verify transactions`);

    } catch (error) {
        console.error("Error updating transactions:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

updateVerifyTransactions();