import express from 'express'
import {companyRegister,companyVarification,companyLogin,companyforgetPassword,companyResetPassword}  from '../controllers/companyControllers/companyAuthController.js'
const companyRoute = express()

companyRoute.post('/register',companyRegister)
companyRoute.post('/varification',companyVarification)
companyRoute.post('/login',companyLogin)
companyRoute.post('/forgetPassword',companyforgetPassword)
companyRoute.post('/resetPassword',companyResetPassword)



export default companyRoute