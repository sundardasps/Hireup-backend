import userDb from "../../models/userModel.js";
import categoryDb from "../../models/categoryModel.js";
import jobDb from "../../models/companyPostModel.js";
import cloudinary from "cloudinary/lib/cloudinary.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import user from "../../models/userModel.js";

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
      query.$or = [
        { job_title: { $regex: new RegExp(search, "i") } },
        { companyName: { $regex: new RegExp(search, "i") } },
        { companyLocation: { $regex: new RegExp(search, "i") } },
        { job_type: { $regex: new RegExp(search, "i") } },
        {required_skills:{$regex:new RegExp(search,"i")}}
      ];
    }
  
 
    // if (filter) {
    //   query.job_title = { $regex: new RegExp(filter, "i") };
    // }
    const allJobs = await jobDb.find(query).sort({createdAt:-1});
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
    const { name, title, place, number } = req.body;
    const updated = await userDb.findOneAndUpdate(
      { _id: req.headers.userId },
      { $set: { userName: name, number, userTitle: title, place } }
    );
    if (updated) {
      return res.status(200).json({
        updated: true,
        updated,
        message: "Details updated successsfully!",
      });
    } else {
      return res.status(200).json({
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

    const updateData = await userDb.findOneAndUpdate(
      { _id: req.headers.userId },
      {
        $set: { userDp: uploadedImage.url },
      }
    );

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

    const updateData = await userDb.findOneAndUpdate(
      { _id: req.headers.userId },
      {
        $set: { userCoverDp: uploadedImage.url },
      }
    );

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

//--------------------------------------------------Add skills----------------------------------------//

export const addSkills = async (req, res) => {
  try {
    const data = req.body;
    const skill = data.skill;
    const exist = await userDb.findOne({
      _id: req.headers.userId,
      "skills.skill": skill,
    });
    if (exist) {
      return res
        .status(200)
        .json({ updated: false, message: "Skill already added" });
    } else {
      const updated = await userDb.findOneAndUpdate(
        { _id: req.headers.userId },
        { $push: { skills: data } }
      );
      if (updated) {
        return res.status(200).json({ updated: true, message: "Skill added" });
      } else {
        return res.status(200).json({
          updated: false,
          message: "somthing error while adding skill",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------------Delete skill----------------------------------------//

export const deleteSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    const result = await userDb.updateOne(
      { _id: req.headers.userId },
      { $pull: { skills: { skill: skill } } }
    );

    if (result) {
      return res.status(200).json({ updated: true, message: "Skill deleted!" });
    } else {
      return res.status(200).json({
        updated: false,
        message: "somthing error while removing skill",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------------Add experience----------------------------------------//

export const addExperience = async (req, res) => {
  try {
    const { experience } = req.body;
    const trimmedExperience = experience.trim()

    const exist = await userDb.findOne({
      _id: req.headers.userId,
      experience:trimmedExperience,
    });
    if (exist) {
      return res.json({ created: false, message: "Experience already exist!" });
    } else {
      const creadted = await userDb.findOneAndUpdate(
        { _id: req.headers.userId },
        { $push: { experience: trimmedExperience } }
      );
      if (creadted) {
        return res
          .status(200)
          .json({ created: true, message: "Experience added!" });
      } else {
        return res.json({
          creadted: false,
          message: "somthing error while adding experience!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------------Edit experience----------------------------------------//

export const editExperience = async (req, res) => {
  try {
    const { value, edited } = req.body;
    const userId = req.headers.userId;
    const exist = await userDb.findOne({
      _id: req.headers.userId,
      experience:edited,
    });
    if (exist) {
      return res.json({ updated: false, message: "Make any changes and update!" });
    } else {
      const query = { _id: userId, experience: value };
      const update = { $set: { "experience.$": edited } };
      const options = { new: true };
      const updated = await userDb.findOneAndUpdate(query, update, options);
      if (updated) {
        return res
          .status(200)
          .json({ updated: true, message: "Experience edited!" });
      } else {
        return res.json({
          updated: false,
          message: "somthing error while edit experience!",
        });
      }
    }
  } catch (error) {}
};

//--------------------------------------------------Delete experience----------------------------------------//

export const deleteExperience = async (req,res) =>{
      
      try {
            const {experience} = req.params
            const trimmedExperience = experience.trim()
            console.log(typeof trimmedExperience);
            const updated =  await userDb.updateOne(
              { _id: req.headers.userId },
              { $pull: { experience : trimmedExperience } }
            );
            if(updated.modifiedCount === 1){
              return res.status(200).json({update:true,message:"Deleted"})
            }else{
              return res.json({update:false,message:"somthing error while delete experience!"})
            }

           
       } catch (error) {
        
      }

}