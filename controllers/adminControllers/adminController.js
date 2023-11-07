import userDb  from '../../models/userModel.js'


//---------------------------------------Users list-------------------------------------//

export const usersList = async (req,res)  =>{

    try {
        const usersData = await userDb.find()
        if(usersData){
           return  res.status(200).json({ status:true,usersData})
        }else{
            res.json({message:"Network error"})
        }
    } catch (error) {
      
    }

}