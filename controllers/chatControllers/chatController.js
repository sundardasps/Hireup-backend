import chatModel from "../../models/chat/chatModel.js";
import companyDb from '../../models/companyModel.js'
import userDb from '../../models/userModel.js'
//------------------Users section----------------------------------------//

export const createChat = async (req, res) => {
  try {
    const currentuserId =req.body.userId
    const receiverId =req.body.companyId
      const exist = await chatModel.findOne({members:{$all:[currentuserId,receiverId]}})
      if(exist){
      res.status(200).json({result:exist});
      }else{
        const newChat = new chatModel({
          members: [currentuserId, receiverId],
        });
      const result = await newChat.save();
      res.status(200).json(result);
      }

  } catch (error) {
    console.log(error);
  }
};

//------Users section--------//

export const userChats = async (req, res) => {
  try {

    const {currentUserId} = req.params
    const chats = await chatModel.find({
      members: { $in: [currentUserId] },
    } )
    if(chats){
    return res.status(200).json(chats);
    }
  } catch (error) {
    console.log(error);
  }
};

//-------Users section------------//

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

//----Find single company------//

export const getSingleCompany = async (req,res) =>{
     try{
     const currentUser = String(req.headers.userId) 
     const companyData = await companyDb.findOne({_id:req.params.companyId})
     const chat = await chatModel.findOne({
      members: { $all: [currentUser, req.params.companyId] },
     }); 
      if(companyData){
        return res.status(200).json({companyData,chat})
      }else{
        return res.status(402).json()
      }
     } catch (error) {
      console.log(error);
     }
}

//--------------------------------------------Company section----------------------------------------//

export const companyCreateChat = async (req, res) => {
    
  try {
    const currentuserId =req.body.userId
    const receiverId =req.body.companyId
      const exist = await chatModel.findOne({members:{$all:[currentuserId,receiverId]}})
      if(exist){
      res.status(200).json({result:exist});
      }else{
        const newChat = new chatModel({
          members: [currentuserId, receiverId],
        });
      const result = await newChat.save();
      res.status(200).json(result);
      }
}catch(error){
  console.log(error);
}
}

//------Comapany all section--------//

export const companyChats = async (req, res) => {
try {
  const {currentUserId} = req.params
  const chats = await chatModel.find({
    members: { $in: [currentUserId] },
  });
  if(chats){
  return res.status(200).json(chats);
  }
} catch (error) {
  console.log(error);
}
};

//-------Comapany findchat------------//

export const companyFindChat = async (req, res) => {
try {
  const chat = await chatModel.findOne({
    members: { $all: [req.headers.userId, req.params.senderId] },
  });
  res.status(200).json(chat)
} catch (error) {
  console.log(error);
}
};

//----Find single user------//

export const getSingleUser = async (req,res) =>{
   try{
    const currentUser = String(req.headers.companyId) 
   const companyData = await userDb.findOne({_id:req.params.userId})
   const chat = await chatModel.findOne({
    members: { $all: [currentUser, req.params.userId] },
   }); 
    if(companyData){
      return res.status(200).json({companyData,chat})
    }else{
      return res.status(402).json()
    }
   } catch (error) {
    console.log(error);
   }
}


