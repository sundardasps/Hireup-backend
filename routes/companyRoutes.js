import express from 'express'
import {companyRegister,companyVarification,companyLogin}  from '../controllers/companyControllers/companyAuthController.js'
const companyRoute = express()

companyRoute.post('/register',companyRegister)
companyRoute.post('/varification',companyVarification)
companyRoute.post('/login',companyLogin)

export default companyRoute