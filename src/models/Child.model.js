import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    ageMonths: { type: Number, required: true, min: 0 }, // store months for pediatrics
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    weightKg: { type: Number, min: 0 }, // optional
  },
  { timestamps: true }
);

export default mongoose.model("Child", childSchema);
