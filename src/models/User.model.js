import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "Full name is required"],
      minlength: [2, "Full name must be at least 2 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    phone: {
      type: String,
      trim: true,
      // required: [true, "Phone number is required"],   // ← make required if you want
      // match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"],  // optional E.164 check
    },

    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["parent", "doctor", "admin"],
      required: [true, "Role is required"],
      lowercase: true, // normalize to lowercase
    },

    // Optional: if doctor needs clinic link later (you had clinicId)
    // clinicId: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", default: null },

    // Good to have for security & debugging
    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: hide passwordHash in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;