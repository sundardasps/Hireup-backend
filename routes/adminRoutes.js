import express from 'express'
import { adminLogin} from '../controllers/adminControllers/adminAuthController.js'
import { usersList ,userBlockOrUnblock} from '../controllers/adminControllers/adminController.js'

const adminRoute = express()

adminRoute.get("/users",usersList)
adminRoute.post("/login",adminLogin)
adminRoute.post("/userBlockOrUnblock",userBlockOrUnblock)



export default adminRoute