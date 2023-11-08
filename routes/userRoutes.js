
import express from "express";
import {
  userLogin,
  userSignUp,
  userVarification,
  forgetPassword,
  resetPassword,
  googleRegister
} from "../controllers/userControllers/userAuthController.js";

const userRoute = express();

userRoute.post("/sigUp", userSignUp);
userRoute.post("/login", userLogin);
userRoute.post("/varification", userVarification);
userRoute.post("/forgetPassword", forgetPassword);
userRoute.post("/resetPassword", resetPassword);
userRoute.post('/userRegisterWithGoole',googleRegister)

export default userRoute;
