import mongoose from "mongoose"
import Course from "./Course.js"

const purchaseSchema = new mongoose.Schema(
    {
        courseId: {type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true},
        userId: {type: String, ref: "User", required: true},
        purchaseDate: {type: Date, default: Date.now},
        amount: {type: Number, required: true},
        status: {type: String, enum: ["pending", "completed", "failed"], default: "pending"}
    },{timestamps: true}
)

export const Purchase = mongoose.model("Purchase", purchaseSchema)