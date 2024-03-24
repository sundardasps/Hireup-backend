import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    members: {
      type: Array,
    },
    last_Message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model("chat", chatSchema);
export default chatModel;
