import companyDb  from  '../../models/companyModel.js'

export const companyDetails = async (req,res) =>{

    try {
        const {email} = req.params
        const exist = await companyDb.findOne({email})
        console.log(exist);
        if(exist){
          return res.status(200).json({data:exist,status:true})
        }else{
          return res.status(200).json({data:exist,status:false ,message:"Something error while fetching data!"})
        }
    } catch (error) {
        
    }

}