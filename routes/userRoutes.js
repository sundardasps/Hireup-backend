import express from "express";
import {
  userLogin,
  userSignUp,
  userVarification,
  forgetPassword,
  resetPassword,
  googleRegister,
} from "../controllers/userControllers/userAuthController.js";
import { getCategory } from "../controllers/userControllers/userController.js";
import {userAuth}  from '../middleWares/auth.js'

const userRoute = express();

userRoute.post("/sigUp", userSignUp);
userRoute.post("/login",userAuth,userLogin);
userRoute.post("/varification", userVarification);
userRoute.post("/forgetPassword", forgetPassword);
userRoute.post("/resetPassword", resetPassword);
userRoute.post("/userRegisterWithGoole", googleRegister);

userRoute.get("/categoryDataForUser", getCategory);

export default userRoute;
