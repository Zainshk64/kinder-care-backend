import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "audio"], required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true, index: true },

    // ✅ required so clinic staff can see the case
    clinicId: { type: String, required: true, index: true }, // e.g. "clinic_001"

    symptoms: [{ type: String, required: true }],
    severity: { type: String, enum: ["mild", "moderate", "severe"], required: true },
    duration: { type: String, required: true, trim: true },
    inputType: { type: String, enum: ["text", "voice", "image", "mixed"], default: "text" },

    status: {
      type: String,
      enum: ["SUBMITTED", "IN_REVIEW", "FOLLOWUP_NEEDED", "CLOSED", "CANCELLED"],
      default: "SUBMITTED",
      index: true,
    },

    attachments: [attachmentSchema],

    clinicNotes: [
      {
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        note: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Case", caseSchema);
