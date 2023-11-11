import express from 'express'
import { adminLogin} from '../controllers/adminControllers/adminAuthController.js'
import { usersList ,userBlockOrUnblock,companiesList,companyBlockOrUnblock,addCategoryTitle} from '../controllers/adminControllers/adminController.js'

const adminRoute = express()
adminRoute.post("/login",adminLogin)

//-------------------------------------------Users section----------------------------------------//

adminRoute.get("/users",usersList)
adminRoute.put("/userBlockOrUnblock/:id",userBlockOrUnblock)

//-------------------------------------------Companies section-------------------------------------//
adminRoute.get("/companies",companiesList)
adminRoute.put("/companyBlockOrUnblock/:id",companyBlockOrUnblock)


//-------------------------------------------Category section-------------------------------------//
adminRoute.post("/addTile",addCategoryTitle)


export default adminRoute