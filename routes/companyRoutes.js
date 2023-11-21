import express from "express";
import {
  companyRegister,
  companyVarification,
  companyLogin,
  companyforgetPassword,
  companyResetPassword,
  googleRegister,
} from "../controllers/companyControllers/companyAuthController.js";
import  {addcompanyFullDetails,companyAddPost} from '../controllers/companyControllers/companyController.js'

import {companyAuth} from '../middleWares/auth.js'
import upload from "../middleWares/multer.js";

const companyRoute = express();

companyRoute.post("/register", companyRegister);
companyRoute.post("/varification", companyVarification);
companyRoute.post("/login", companyLogin);
companyRoute.post("/forgetPassword", companyforgetPassword);
companyRoute.post("/resetPassword", companyResetPassword);
companyRoute.post("/companyRegisterWithGoole", googleRegister);
companyRoute.post("/companyFullDetails/:id",upload.single("image"),addcompanyFullDetails);
companyRoute.post("/addPost",companyAuth,companyAddPost);



export default companyRoute;
