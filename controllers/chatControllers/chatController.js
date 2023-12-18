import chatModel from "../../models/chat/chatModel.js";
import companyDb from '../../models/companyModel.js'
//--------------------------------------------------Users section----------------------------------------//


export const createChat = async (req, res) => {
    
    try {
      const newChat = new chatModel({
        members: [req.headers.userId, req.body.receiverId],
      });
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------------Users section----------------------------------------//

export const userChats = async (req, res) => {
  try {
    const chats = await chatModel.find({
      members: { $in: [req.headers.userId] },
    });
    if(chats){
    return res.status(200).json(chats);
    }
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------------Users section----------------------------------------//

export const findChat = async (req, res) => {
  try {
    const chat = await chatModel.findOne({
      members: { $all: [req.headers.userId, req.params.senderId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------------Find single company----------------------------------------//

export const getSingleCompany = async (req,res) =>{
     try{
     const companyData = await companyDb.findOne({_id:req.params.companyId})
      if(companyData){
        return res.status(200).json(companyData)
      }else{
        return res.status(402).json()
      }
     } catch (error) {
      console.log(error);
     }
}

