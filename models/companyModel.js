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
  is_google: {
    type: Boolean,
    default: false,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  company_roles: {
    type: String,
    default: "",
  },
  gst_number: {
    type: String,
    defult: "",
  },
  address: {
    type: String,
    default: "",
  },
  size:{
    type:String,
    default:""
  },
  is_completed: {
    type:Number,
    default:0,
  },
  jobs:{
    type:Array,
    default:[]
  }
});

const company = mongoose.model("company", companySchema);
export default company;
