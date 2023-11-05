// const express = require('express')
// const userController = require('../controllers/userControllers/userAuthController')

import express from 'express'
import {userLogin,userSignUp, userVarification} from '../controllers/userControllers/userAuthController.js'
const userRoute = express()


userRoute.post('/sigUp',userSignUp)
userRoute.post('/login',userLogin)
userRoute.post('/varification',userVarification)


export default userRoute
