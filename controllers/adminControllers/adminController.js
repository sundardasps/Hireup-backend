import userDb from "../../models/userModel.js";

//---------------------------------------Users list-------------------------------------//

export const usersList = async (req, res) => {
  try {
     const {page ,search,filter} = req.query

    let query = {is_admin : false}
    
   if(filter === "Active"){
       query.is_blocked = false
   }else if(filter === "Blocked"){
       query.is_blocked = true
   } if(search){
      query.userName = { $regex: new RegExp(search, "i") };
    }
   
     let skip = (page -1 ) * 4

    const count = await userDb.find().countDocuments()
    const userData = await userDb.find(query).skip(skip).limit(4);

    if (userData) {
   console.log(count,page,search,filter);
      
      return res.status(200).json({ status: true, data:userData, count});
    } else {
      res.json({ message: "Network error" });
    }
  } catch (error) {}
};

//----------------------------------- Users Block or UnBlock ----------------------------------//

export const userBlockOrUnblock = async (req, res) => {
  try {
    const  id  = req.params.id;
      console.log(id,"======================");
    const user = await userDb.findOne({ _id: id });
   const updated = await userDb.findByIdAndUpdate(
      { _id: id },
      { $set: { is_blocked: !user.is_blocked } }
    );
    if(updated){
      return res.status(200).json({updated:true})
    }else{
      return res.status(200).json({updated:false})
    }
  } catch (error) {}
};
