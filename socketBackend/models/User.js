import "../conn.js";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  score: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
