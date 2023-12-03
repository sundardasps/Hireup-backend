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
  is_google:{
    type:Boolean,
    default:false
  },
  is_blocked:{
    type:Boolean,
    default:false
  },
  userTitle:{
    type:String,
    default:"Add a title"
  },
  userDp:{
    type:String,
    default:""
  },
  userCoverDp:{
    type:String,
    default:""
  },
  place:{
    type:String,
    default:"Share where I live"
  },
  skills:{
    type:Array,
    default:[]
  },
  experience:{
    type:Array,
    default:[]
  }
  ,
  education:{
    type:Array,
    default:[]
  },
  appliedJobs:{
    type:Array,
    default:[]
  },
  

});

const user = mongoose.model("user", userSchema);

export default user;
