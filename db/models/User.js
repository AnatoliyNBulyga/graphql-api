import mongoose from "mongoose";

const userRole = ["USER", "ADMIN"];

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: userRole,
      default: userRole[0],
    },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
