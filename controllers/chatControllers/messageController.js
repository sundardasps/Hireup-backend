import messageModel from "../../models/chat/messageModel.js";
import chatModel from '../../models/chat/chatModel.js'
//----------------------------User side --------------------------//
export const addMessage = async (req, res) => {
  try {
    const { chatId, senderId, text,recieverId } = req.body;
    const AddLastMessage = await chatModel.findOneAndUpdate({
      members: { $all: [senderId, recieverId] },
    },{$set:{last_Message:text}});
   if(AddLastMessage){
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });
    const result = await message.save();
    return res.status(200).json(result);
 }
    

  } catch (error) {
    console.log(error);
  }
};

export const getMessages = async (req,res) =>{
    try {
        const result = await messageModel.find({chatId:req.params.chatId})
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
    }
}

//----------------------------Company side --------------------------//
export const companyAddMessage = async (req, res) => {
  try {
    const { chatId, senderId, text,recieverId } = req.body;
    const AddLastMessage = await chatModel.findOneAndUpdate({
      members: { $all: [senderId, recieverId] },
    },{$set:{last_Message:text}})
   if(AddLastMessage){
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });
    const result = await message.save();
    return res.status(200).json(result);
 }
  } catch (error) {
    console.log(error);
  }
};

export const companyGetMessages = async (req,res) =>{
    try {
        const result = await messageModel.find({chatId:req.params.chatId})
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
    }
}