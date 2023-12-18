import express from "express";
import {
  userLogin,
  userSignUp,
  userVarification,
  forgetPassword,
  resetPassword,
  googleRegister,
} from "../controllers/userControllers/userAuthController.js";
import {
  getAllJobs,
  getCategory,
  getProfile,
  editProfile,
  editUserDp,
  editUserBgImg,
  addSkills,
  deleteSkill,
  addExperience,
  editExperience,
  deleteExperience,
  getAllCompany,
  addEducation,
  editEducation,
  deleteEducation,
  applyJob,
  appliedJobList,
  checkJobappliedOrNot,
  checkJobAppliedStatus,
} from "../controllers/userControllers/userController.js";

import {findChat,createChat,userChats,getSingleCompany} from '../controllers/chatControllers/chatController.js'

import {getMessages,addMessage} from '../controllers/chatControllers/messageController.js'

import { userAuth } from "../middleWares/auth.js";
import upload from "../middleWares/multer.js";
const userRoute = express();

userRoute.post("/sigUp", userSignUp);
userRoute.post("/login", userLogin);
userRoute.post("/varification", userVarification);
userRoute.post("/forgetPassword", forgetPassword);
userRoute.post("/resetPassword", resetPassword);
userRoute.post("/userRegisterWithGoole", googleRegister);

userRoute.get("/categoryDataForUser", userAuth, getCategory);
userRoute.get("/getAllJobs", userAuth, getAllJobs);

userRoute.get("/profile", userAuth, getProfile);
userRoute.put("/EditProfile", userAuth, editProfile);
userRoute.post("/EditDp", userAuth, upload.single("image"), editUserDp);
userRoute.post("/EditBgImg", userAuth, upload.single("image"), editUserBgImg);

userRoute.post("/addSkill", userAuth, addSkills);
userRoute.post("/deleteSkill", userAuth, deleteSkill);

userRoute.post("/addExperience", userAuth,addExperience);
userRoute.put("/editExperience", userAuth,editExperience);
userRoute.post("/deleteExperience/:experience",userAuth,deleteExperience);

userRoute.post("/addEducation",userAuth,addEducation)
userRoute.patch("/editEducation",userAuth,editEducation)
userRoute.put("/deleteEducation",userAuth,deleteEducation)

userRoute.post("/applyJOb",userAuth,upload.single("resume"),applyJob)
userRoute.get("/getAppliedJobs",userAuth,appliedJobList)
userRoute.get("/checkJobAppliedOrNot",userAuth,checkJobappliedOrNot)
userRoute.get("/checkJobAppliedStatus",userAuth,checkJobAppliedStatus)

userRoute.get("/getAllCompany",getAllCompany);


//----------------------------User chat --------------------//
userRoute.get("/chat",userAuth,userChats)
userRoute.get("/getSingleCompany/:companyId",userAuth,getSingleCompany)

userRoute.post("/addMessage",userAuth,addMessage)
userRoute.get("/getMessage/:chatId",userAuth,getMessages)




export default userRoute;
