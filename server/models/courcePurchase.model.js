import mongoose from "mongoose";


const courcePurchaseSchema = new mongoose.Schema({
    courceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cource",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: "pending",
    },
    razorpayOrderId: {
        type: String,
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpaySignature: {
        type: String,
    },
}, { timeStamp: true });

export const CourcePurchase = mongoose.model("CourcePurchase", courcePurchaseSchema);
