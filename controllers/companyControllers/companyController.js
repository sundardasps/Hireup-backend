import companyDb from "../../models/companyModel.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import {tokenJwt} from '../../utils/authTokens.js'

export const addcompanyFullDetails = async (req, res) => {
  try {
    const {
      companyName,
      companyLocation,
      companyAddress,
      size,
      gstNumber,
      companyRoles,
    } = req.body;
    

    const img = req.file.path;
    const id = req.params.id;
    const uploadedImage = await uploadToCloudinary(img, "companyDp");
    const userData = await companyDb.findOneAndUpdate({ _id: id },{$set:{
        address:companyAddress,
        image:uploadedImage.url,
        location:companyLocation,
        company_roles:companyRoles,
        gst_number:gstNumber,
        is_completed:true,
        companyName,
        size,
    }});
    const jwtToken = tokenJwt(userData);
    if(userData){
         return res.status(200).json({userData,updated:true,jwtToken})
    }else{
        return res.status(200).json({userData,updated:false,message:"Somthing error!"})
    }

  } catch (error) {}
};


