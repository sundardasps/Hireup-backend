import userDb from "../../models/userModel.js";
import categoryDb from "../../models/categoryModel.js";
import jobDb from "../../models/companyPostModel.js";
import cloudinary from "cloudinary/lib/cloudinary.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
//--------------------------------------------------Get cateogry----------------------------------------//

export const getCategory = async (req, res) => {
  try {
    const categoryData = await categoryDb.find({ is_active: true });
    if (categoryData) {
      return res.status(200).json({ status: true, data: categoryData });
    } else {
      res.json({ message: "Network error" });
    }
  } catch (error) {}
};

//--------------------------------------------------Get jobs----------------------------------------//

export const getAllJobs = async (req, res) => {
  try {
    const { search, filter } = req.query;

    let query = { is_active: true };

    if (search) {
      query.job_title = { $regex: new RegExp(search, "i") };
    }

    if (filter) {
      query.job_title = { $regex: new RegExp(filter, "i") };
    }
    const allJobs = await jobDb.find(query);
    console.log(allJobs);
    if (allJobs) {
      return res.status(200).json({ dataFetched: true, data: allJobs });
    } else {
      return res.json({ dataFetched: false, data: allJobs });
    }
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------------Get profile----------------------------------------//

export const getProfile = async (req, res) => {
  try {
    const exist = await userDb.findOne({ _id: req.headers.userId });
    if (exist) {
      return res.status(200).json({ fetched: true, exist });
    } else {
      return res.status(200).json({ fetched: false, data: [] });
    }
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------------Edit profile----------------------------------------//

export const editProfile = async (req, res) => {
  try {
    const { name, title, place, email, number } = req.body;
    const updated = await userDb.findOneAndUpdate(
      { _id: req.headers.userId },
      { $set: { userName: name, email, number, userTitle: title, place } }
    );
    if (updated) {
      return res
        .status(200)
        .json({
          updated: true,
          updated,
          message: "Details updated successsfully!",
        });
    } else {
      return res
        .status(200)
        .json({
          updated: false,
          updated: [],
          message:
            "An error occurred during the update process. Please try again.",
        });
    }
  } catch (error) {
    console.log(error);
  }
};


//--------------------------------------------------Edit Dp----------------------------------------//

export const editUserDp = async (req, res) => {
  try {
    const userData = await userDb.findOne({ _id: req.headers.userId });
    
    const prevImage = userData.userDp;
    const match = prevImage.match(/\/v\d+\/(.+?)\./);
    const publicId = match ? match[1] : null;
    
    const img = req.file.path;
    const uploadedImage = await uploadToCloudinary(img, "userDp");
    console.log(uploadedImage,"[[[");

    const updateData = await userDb.findOneAndUpdate({_id:req.headers.userId},{
     $set:{ userDp: uploadedImage.url,}
    });

    if (updateData) {
        cloudinary.v2.uploader
        .destroy(publicId)
        .then((res) => console.log("prev image deleted"));
      return res
        .status(200)
        .json({ updated: true, message: "Image updated successfully!" });
    } else {
      return res.status(200).json({
        updated: false,
        message: "somthing error while updating image!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};


//--------------------------------------------------Edit Bgimage----------------------------------------//

export const editUserBgImg = async (req, res) => {
  try {
    const userData = await userDb.findOne({ _id: req.headers.userId });
    const prevImage = userData.userCoverDp;
    const match = prevImage.match(/\/v\d+\/(.+?)\./);
    const publicId = match ? match[1] : null;
    
    const img = req.file.path;
    const uploadedImage = await uploadToCloudinary(img, "userBgimg");

    const updateData = await userDb.findOneAndUpdate({_id:req.headers.userId},{
     $set:{ userCoverDp: uploadedImage.url,}
    });

    if (updateData) {
        cloudinary.v2.uploader
        .destroy(publicId)
        .then((res) => console.log("prev image deleted"));
      return res
        .status(200)
        .json({ updated: true, message: "Image updated successfully!" });
    } else {
      return res.status(200).json({
        updated: false,
        message: "somthing error while updating image!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
