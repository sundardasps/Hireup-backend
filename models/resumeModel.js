import mongoose from 'mongoose'

const resumeSchema = mongoose.Schema({

    userId:{
        type:String,
    },
    resume:{
        type:String,
    },
    resumeName:{
        type:String,
    }

})

const resumeModel = await mongoose.model("resume",resumeSchema)
export default resumeModel