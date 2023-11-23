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
} from "../controllers/companyControllers/companyController.js";

import { companyAuth } from "../middleWares/auth.js";
import upload from "../middleWares/multer.js";

const companyRoute = express();

companyRoute.post("/register", companyRegister);
companyRoute.post("/varification", companyVarification);
companyRoute.post("/login", companyLogin);
companyRoute.post("/forgetPassword", companyforgetPassword);
companyRoute.post("/resetPassword", companyResetPassword);
companyRoute.post("/companyRegisterWithGoole", googleRegister);
companyRoute.post("/companyFullDetails/:id",upload.single("image"),addcompanyFullDetails);

companyRoute.post("/addPost", companyAuth, companyAddPost);
companyRoute.put("/editPost/:id", companyAuth,editPost);

companyRoute.get("/getPost", companyAuth, getPostCompany);
companyRoute.get("/postDetails/:id", companyAuth, jobFullDetails);
companyRoute.post("/editProfile", companyAuth, editeProfile);
companyRoute.get("/companyDetails", companyAuth,getCompanyProfile);
companyRoute.post("/changeProfileImage",companyAuth,upload.single("image"),editeProfileImage);


export default companyRoute;
