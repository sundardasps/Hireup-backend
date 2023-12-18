import messageModel from "../../models/chat/messageModel.js";

export const addMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getMessages = async (req,res) =>{
    try {
        console.log(req.params.chatId);
        const result = await messageModel.find({chatId:req.params.chatId})
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
    }
}