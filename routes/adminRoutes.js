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
  titleBlockorUnblock
} from "../controllers/adminControllers/adminController.js";
import { adminAuth } from "../middleWares/auth.js";
const adminRoute = express();
adminRoute.post("/login", adminLogin);

//-------------------------------------------Users section----------------------------------------//

adminRoute.get("/users", usersList);
adminRoute.put("/userBlockOrUnblock/:id", userBlockOrUnblock);

//-------------------------------------------Companies section-------------------------------------//
adminRoute.get("/companies", companiesList);
adminRoute.post("/companyBlockOrUnblock/:id",adminAuth,companyBlockOrUnblock);

//-------------------------------------------Category section-------------------------------------//
adminRoute.get("/categoryData",categoryList);
adminRoute.post("/addTile", addCategoryTitle);
adminRoute.get("/getTitle", getCategoryTitle);
adminRoute.post("/addCategory", addCategory);
adminRoute.put('/catgoryBlockOrUnblock/:id',titleBlockorUnblock)

export default adminRoute;
