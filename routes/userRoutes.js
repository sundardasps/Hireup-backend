import express from "express";
import {
  userLogin,
  userSignUp,
  userVarification,
  forgetPassword,
  resetPassword,
  googleRegister,
} from "../controllers/userControllers/userAuthController.js";
import { getAllJobs, getCategory ,getProfile,editProfile} from "../controllers/userControllers/userController.js";
import {userAuth}  from '../middleWares/auth.js'

const userRoute = express();

userRoute.post("/sigUp", userSignUp);
userRoute.post("/login",userLogin);
userRoute.post("/varification", userVarification);
userRoute.post("/forgetPassword", forgetPassword);
userRoute.post("/resetPassword", resetPassword);
userRoute.post("/userRegisterWithGoole", googleRegister);

userRoute.get("/categoryDataForUser",userAuth,getCategory);
userRoute.get("/getAllJobs",userAuth,getAllJobs);

userRoute.get("/profile",userAuth,getProfile)
userRoute.put("/EditProfile",userAuth,editProfile)




export default userRoute;
