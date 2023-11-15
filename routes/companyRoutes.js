import express from "express";
import {
  companyRegister,
  companyVarification,
  companyLogin,
  companyforgetPassword,
  companyResetPassword,
  googleRegister,
} from "../controllers/companyControllers/companyAuthController.js";
import  {addcompanyFullDetails} from '../controllers/companyControllers/companyController.js'
import upload from "../middleWares/multer.js";
const companyRoute = express();

companyRoute.post("/register", companyRegister);
companyRoute.post("/varification", companyVarification);
companyRoute.post("/login", companyLogin);
companyRoute.post("/forgetPassword", companyforgetPassword);
companyRoute.post("/resetPassword", companyResetPassword);
companyRoute.post("/companyRegisterWithGoole", googleRegister);
companyRoute.post("/companyFullDetails/:id",upload.single("image"),addcompanyFullDetails);



export default companyRoute;
