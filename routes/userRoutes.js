// const express = require('express')
// const userController = require('../controllers/userControllers/userAuthController')

import express from 'express'
import {userLogin,userSignUp, userVarification,forgetPassword,resetPassword} from '../controllers/userControllers/userAuthController.js'
const userRoute = express()


userRoute.post('/sigUp',userSignUp)
userRoute.post('/login',userLogin)
userRoute.post('/varification',userVarification)
userRoute.post('/forgetPassword',forgetPassword)
userRoute.post('/resetPassword',resetPassword)




export default userRoute
