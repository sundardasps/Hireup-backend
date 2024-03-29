import express from "express";
import { adminLogin } from "../controllers/adminControllers/adminAuthController.js";
import {
  usersList,
  userBlockOrUnblock,
  companiesList,
  companyBlockOrUnblock,
  addCategoryTitle,
  getCategoryTitle,
  addCategory,
  categoryList,
  titleBlockorUnblock,
  deleteSubcategory,
  getDashboard,
  approveComapny,
  jobFullDetails,
} from "../controllers/adminControllers/adminController.js";

import { adminAuth } from "../middleWares/auth.js";
const adminRoute = express();
adminRoute.post("/login", adminLogin);

//-------------------------------------------Users section----------------------------------------//

adminRoute.get("/users", adminAuth, usersList);
adminRoute.put("/userBlockOrUnblock/:id", adminAuth, userBlockOrUnblock);

//-------------------------------------------Companies section-------------------------------------//
adminRoute.get("/companies", adminAuth, companiesList);
adminRoute.post("/companyBlockOrUnblock/:id", adminAuth, companyBlockOrUnblock);
adminRoute.put("/companyApprovel/:id", adminAuth, approveComapny);
adminRoute.get("/jobDetails/:id", adminAuth, jobFullDetails);

//-------------------------------------------Category section-------------------------------------//
adminRoute.get("/categoryData", adminAuth, categoryList);
adminRoute.post("/addTile", adminAuth, addCategoryTitle);
adminRoute.get("/getTitle", adminAuth, getCategoryTitle);
adminRoute.post("/addCategory", addCategory, addCategory);
adminRoute.put("/catgoryBlockOrUnblock/:id", adminAuth, titleBlockorUnblock);
adminRoute.post("/deleteSubcategory", adminAuth, deleteSubcategory);

//-------------------------------------------Category section-------------------------------------//
adminRoute.get("/getDashboard", adminAuth, getDashboard);

export default adminRoute;
