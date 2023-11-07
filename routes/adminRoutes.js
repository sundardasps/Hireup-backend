import express from 'express'
import { adminLogin} from '../controllers/adminControllers/adminAuthController.js'
import { usersList } from '../controllers/adminControllers/adminController.js'

const adminRoute = express()

adminRoute.post("/login",adminLogin)
adminRoute.get("/users",usersList)


export default adminRoute