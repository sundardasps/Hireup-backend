import cloudinary from "cloudinary";
import { config } from 'dotenv';          
config();



cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME ,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
  secure: true
});



const uploadToCloudinary = async (path , folder) => {
    try {
          const data = await cloudinary.v2.uploader.upload(path, { folder });
          return { url: data.url, public_id: data.public_id };
      } catch (error) {
          console.log(error);
      }
  }


 const MultiUploadCloudinary = async (files,folder) => {
    try {
        const uploadedImages = [];
        for (const file of files) {
            const { path } = file;
            const result = await uploadToCloudinary(path,folder); 
            if (result.url) {
                uploadedImages.push(result.url);
            }
        }
        return uploadedImages;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export {uploadToCloudinary}