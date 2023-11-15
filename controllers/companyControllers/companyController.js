import companyDb  from  '../../models/companyModel.js'


export const addcompanyFullDetails  =  async (req,res) =>{

    try {
        
        const {companyName,companyLocation,companyAddress,size,gstNumber,companyRoles} = req.body
        const imageName = req.file.originalname
        const id = req.params.id
        const userdata = await companyDb.findOne({_id:id})
        console.log(userdata);

    } catch (error) {
    }

}