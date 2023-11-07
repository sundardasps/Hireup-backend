import express from 'express'
import { adminLogin } from '../controllers/adminControllers/adminAuthController.js'
const adminRoute = express()

adminRoute.post("/login",adminLogin)


export default adminRoute