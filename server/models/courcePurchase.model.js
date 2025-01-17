import mongoose from "mongoose";


const courcePurchaseSchema = new mongoose.Schema({
    courceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
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
    paymentId:{
        type:String,
        required:true
    }
}, { timeStamp: true });

export const CourcePurchase = mongoose.model("CourcePurchase", courcePurchaseSchema);
