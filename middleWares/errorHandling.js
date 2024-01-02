export const errorHandler =(err,req,res,next)=>{
    console.log(err.message,"---------------------------------------------------------");
    res.status(404).json({message:"404 error"})
}