import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
