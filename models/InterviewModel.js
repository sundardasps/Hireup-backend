import mongoose from "mongoose";

const interviewSchema = mongoose.Schema({
  jobId: {
    type: String,
  },
  userId:{
    type: String,
  },
  applicationId: {
    type: String,
  },
  interviewer: {
    type: String,
  },
  type: {
    type: String,
  },
  date: {
    type: String,
  },
  requirements: {
    type: String,
  },
  userName: {
    type: String,
  },
  userDp: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  userTitle: {
    type: String,
  },
  userNumber: {
    type: String,
  },
  is_canceled:{
    type:Boolean,
    default:false
  }

},{
  timestamps: true,
});

const scheduledInterview = mongoose.model("InterviewModel", interviewSchema);
export default scheduledInterview