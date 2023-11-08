import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: {
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
    default: "company",
  },
  is_admin: {
    type: String,
    default: false,
  },
  is_google:{
    type:Boolean,
    default:false
  }
});

const company = mongoose.model("company", companySchema);
export default company;
