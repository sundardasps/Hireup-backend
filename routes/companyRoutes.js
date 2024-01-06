import express from "express";
import {
  companyRegister,
  companyVarification,
  companyLogin,
  companyforgetPassword,
  companyResetPassword,
  googleRegister,
} from "../controllers/companyControllers/companyAuthController.js";
import {
  addcompanyFullDetails,
  companyAddPost,
  getPostCompany,
  jobFullDetails,
  editeProfile,
  getCompanyProfile,
  editeProfileImage,
  editPost,
  getUserList,checkCompleted,
  deleteJob,
  getCategory,
  getUserDetails,
  getAppliedUsers,
  getSingleUserApplication,
  rejectUserApplication,
  scheduleInterview,
  getsheduledInterviews,
  reScheduleInterview,
  stripePaymentInstance,
  cancelInterview,paymentSucces,checkPayedorNot
} from "../controllers/companyControllers/companyController.js";
import { companyAuth } from "../middleWares/auth.js";
import upload from "../middleWares/multer.js";
import {companyChats,companyCreateChat,companyFindChat, getSingleUser,} from '../controllers/chatControllers/chatController.js'
import {companyAddMessage,companyGetMessages} from '../controllers/chatControllers/messageController.js'
import { errorHandler } from "../middleWares/errorHandling.js";
const companyRoute = express();

companyRoute.post("/register", companyRegister);
companyRoute.post("/varification", companyVarification);
companyRoute.post("/login", companyLogin);
companyRoute.post("/forgetPassword", companyforgetPassword);
companyRoute.post("/resetPassword", companyResetPassword);
companyRoute.post("/companyRegisterWithGoole", googleRegister);
companyRoute.post("/companyFullDetails/:id",upload.single("image"),addcompanyFullDetails);
companyRoute.get("/checkCompleted",companyAuth,checkCompleted)

companyRoute.post("/addPost", companyAuth,companyAddPost);
companyRoute.put("/editPost/:id", companyAuth,editPost);
companyRoute.get("/getPost", companyAuth, getPostCompany);
companyRoute.get("/postDetails/:id", companyAuth, jobFullDetails);
companyRoute.get("/deleteJob/:id",companyAuth,deleteJob);


companyRoute.post("/editProfile", companyAuth, editeProfile);
companyRoute.get("/companyDetails", companyAuth,getCompanyProfile);
companyRoute.post("/changeProfileImage",companyAuth,upload.single("image"),editeProfileImage);

companyRoute.get("/getUserList",companyAuth,getUserList)
companyRoute.get("/getUserProfile/:id",companyAuth,getUserDetails)
companyRoute.get("/getAppliedUsers/",companyAuth,getAppliedUsers)
companyRoute.put("/getSingleUserApplication",companyAuth,getSingleUserApplication)
companyRoute.put("/rejectUserapplication",companyAuth,rejectUserApplication)

companyRoute.get("/categoryDataForCompany",companyAuth,getCategory)
companyRoute.post("/scheduleInterview",companyAuth,scheduleInterview)
companyRoute.get("/getscheduleInterview",companyAuth,getsheduledInterviews)
companyRoute.patch("/reScheduleInterview",companyAuth,reScheduleInterview)
companyRoute.put("/cancelInterview/:id",companyAuth,cancelInterview)



companyRoute.post("/create-checkout-session",companyAuth,stripePaymentInstance)
companyRoute.post("/paymentsuccess",companyAuth,paymentSucces)
companyRoute.get("/paymentStatus",companyAuth,checkPayedorNot)



//----------------------------Company chat --------------------//
companyRoute.post("/companyCreateChat",companyAuth,companyCreateChat)
companyRoute.get("/chat/:currentUserId",companyAuth,companyChats)
companyRoute.get("/getSingleUser/:userId",companyAuth,getSingleUser)
companyRoute.post("/companyAddMessage",companyAuth,companyAddMessage,)
companyRoute.get("/companyGetMessages/:chatId",companyAuth,companyGetMessages)


companyRoute.use(errorHandler)

export default companyRoute;
