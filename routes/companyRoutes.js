import express from "express";
import {
  companyRegister,
  companyVarification,
  companyLogin,
  companyforgetPassword,
  companyResetPassword,
  googleRegister,
} from "../controllers/companyControllers/companyAuthController.js";
import  {companyDetails} from '../controllers/companyControllers/companyController.js'
const companyRoute = express();

companyRoute.post("/register", companyRegister);
companyRoute.post("/varification", companyVarification);
companyRoute.post("/login", companyLogin);
companyRoute.post("/forgetPassword", companyforgetPassword);
companyRoute.post("/resetPassword", companyResetPassword);
companyRoute.post("/companyRegisterWithGoole", googleRegister);
companyRoute.get("/companyDetails/:email",companyDetails);

export default companyRoute;
