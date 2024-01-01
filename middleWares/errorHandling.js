export const errorHandler =(err,req,res,next)=>{
    res.status(200).json({message:"404 error"})
}