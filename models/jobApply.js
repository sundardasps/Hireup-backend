import mongoose  from 'mongoose'

const applyJobSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    jobId:{
        type:String,
        required:true
    },
    companyId:{
        type:String,
        required:true
    },
    resume:{
       type:String,
       required:true
    }
})

const applyJob = mongoose.model("applyJob",applyJobSchema)
export default applyJob