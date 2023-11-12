import mongoose from "mongoose";

const categories = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  category: {
    type: Array,
    
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

const category = mongoose.model("category", categories);

export default category;
