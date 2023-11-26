import mongoose from "mongoose";

const post = mongoose.Schema({
  job_title: {
    type: String,
    require: true,
  },

  required_skills: {
    type: String,
    require: true,
  },
  experience: {
    type: String,
    require: true,
  },
  job_type: {
    type: String,
    require: true,
  },
  responsibilities: {
    type: String,
    require: true,
  },
  end_time: {
    type: String,
    require: true,
  },
  salery: {
    type: String,
    require: true,
  },
  is_active:{
    type:Boolean,
    default:true
  },
  createdAt:{
    type:Date,
    default:new Date()
  },
  companyName:{
    type:String,
    require:true
  },
  companyImage:{
    type:String,
    require:true
  },
  companyLocation:{
    type:String,
    require:true
  }

});

const jobs = mongoose.model("jobs", post);

export default jobs;
