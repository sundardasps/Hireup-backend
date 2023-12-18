import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    sendId: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("message", messageSchema);
export default messageModel;
