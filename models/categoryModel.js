import mongoose from "mongoose";

const categories = new mongoose.Schema({
  tile: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

const category = mongoose.model("category", categories);

export default category;
