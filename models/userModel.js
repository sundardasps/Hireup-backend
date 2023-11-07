// const mongoose = require('mongoose')
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_varified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
  is_admin: {
    type: String,
    default: false,
  },
});

const user = mongoose.model("user", userSchema);

export default user;
