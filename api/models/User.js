import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
    unique: true
  }, 
  admin: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);