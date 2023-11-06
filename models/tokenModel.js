import mongoose, { Schema } from "mongoose";

const Token = mongoose.Schema({
 
    userId:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },

    companyId:{
        type:Schema.Types.ObjectId,
        ref:"company"
    },

    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        defaultl: Date.now()
    }
})

const authTokenDb = mongoose.model("token",Token)

export default authTokenDb