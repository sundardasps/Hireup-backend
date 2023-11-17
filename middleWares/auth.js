import jwt from'jsonwebtoken'
import userDb from '../models/userModel.js'
import companyDb  from  '../models/companyModel.js'

import dotenv from 'dotenv'

dotenv.config()

export const userAuth = async (req,res,next) =>{

    try {
        console.log(req.headers.authorization);
        if(req.headers.authorization){
            let token = req.headers.Authorization.split("")[1]
            const decode =  jwt.verify(token,process.env.jwtSecretKey)
        }
        console.log("==fdef");
        next()
    } catch (error) {
        
    }

}



export const companyAuth = async (req,res,next) =>{

    try {

         if(req.headers.authorization){
            console.log("in company middle ware")
            next()
            let token = req.headers.authorization.split("")[1]
            const decode =  jwt.verify(token,process.env.jwtSecretKey)
            console.log(decode);
         }
         next()
    } catch (error) {
        
    }

}