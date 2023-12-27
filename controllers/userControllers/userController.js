import userDb from "../../models/userModel.js";
import categoryDb from "../../models/categoryModel.js";
import jobDb from "../../models/companyPostModel.js";
import cloudinary from "cloudinary/lib/cloudinary.js";
import companyDb from "../../models/companyModel.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import applyJobDb from "../../models/jobApply.js";
import sendMail from "../../utils/sendMails.js";
import resumeDb from "../../models/resumeModel.js";
import e from "express";
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
    const jobs = await jobDb.find();
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    jobs.forEach(async (value) => {
      if (value.end_time < formattedDate) {
        await jobDb.findOneAndUpdate(
          { _id: value._id },
          { $set: { is_active: false } }
        );
      }
    });

    const { search, filter,scroll } = req.query;
    let query = { is_delete: false };

    if (search) {
      query.$or = [
        { job_title: { $regex: new RegExp(search, "i") } },
        { companyName: { $regex: new RegExp(search, "i") } },
        { companyLocation: { $regex: new RegExp(search, "i") } },
        { job_type: { $regex: new RegExp(search, "i") } },
      ];
    }

    

    let limit = 7;
    let skip = (scroll - 1) * 7;
    const count = await jobDb.find(query).countDocuments();
    const totalScrolls = Math.ceil(count/limit)
   
    if (filter) {
       skip = 0
      query.job_title = { $regex: new RegExp(filter, "i") };
    }

    const allJobs = await jobDb.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
    if (allJobs) {
      return res.status(200).json({ dataFetched: true, data: allJobs ,count,totalScrolls });
    } else {
      return res.json({ dataFetched: false, data: allJobs,count,totalScrolls });
    }
  } catch (error) {
    console.log(error);  
  }
};

//--------------------------------------------------Get profile----------------------------------------//

export const getProfile = async (req, res) => {
  try {
    const exist = await userDb.findOne({ _id: req.headers.userId });
    const resumeIds = exist.resumes
    const resumesData = await resumeDb.find({_id:resumeIds})
  
    let total = 0;
    if (exist && exist.experience) {
        exist.experience.forEach((value, index) => {
        total = total + Number(value.match(/\d+/g));
      });
    }
    if (exist) {
      return res.status(200).json({ fetched: true, exist, total ,resume:resumesData});
    } else {
      return res.status(200).json({ fetched: false, data: [] ,resume:[]});
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
    const trimmedExperience = experience.trim();

    const exist = await userDb.findOne({
      _id: req.headers.userId,
      experience: trimmedExperience,
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
      experience: edited,
    });
    if (exist) {
      return res.json({
        updated: false,
        message: "Make any changes and update!",
      });
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

export const deleteExperience = async (req, res) => {
  try {
    const { experience } = req.params;
    const trimmedExperience = experience.trim();
    const updated = await userDb.updateOne(
      { _id: req.headers.userId },
      { $pull: { experience: trimmedExperience } }
    );
    if (updated.modifiedCount === 1) {
      return res.status(200).json({ update: true, message: "Deleted" });
    } else {
      return res.json({
        update: false,
        message: "somthing error while delete experience!",
      });
    }
  } catch (error) {}
};

//----------------------------------------Get All company for landing page----------------------------------------//

export const getAllCompany = async (req, res) => {
  try {
    const companyData = await companyDb.find();
    if (companyData) {
      return res
        .status(200)
        .json({ fetched: true, companyData, message: "Data fetched!" });
    } else {
      return res.json({
        fetched: false,
        companyData: [],
        message: "somthing error while fetching the data!",
      });
    }
  } catch (error) {}
};

//----------------------------------------Add education----------------------------------------//

export const addEducation = async (req, res) => {
  try {
    const education = req.body;
    const exist = await userDb.findOne({
      _id: req.headers.userId,
      education: { $all: education },
    });
    if (exist) {
      return res.json({
        created: false,
        message: "same education details already exist!",
      });
    } else {
      const addData = await userDb.findOneAndUpdate(
        { _id: req.headers.userId },
        { $push: { education: education } }
      );
      if (addData) {
        return res.status(200).json({
          created: true,
          message: "Qualification added successfully.",
        });
      } else {
        return res.json({
          created: false,
          message: "somthing error while adding the data!",
        });
      }
    }
  } catch (error) {}
};

//----------------------------------------Edit education----------------------------------------//

export const editEducation = async (req, res) => {
  try {
    const { prevData, editData } = req.body;
    const exist = await userDb.findOne({
      _id: req.headers.userId,
      education: { $all: editData },
    });
    if (exist) {
      return res.json({
        updated: false,
        message: "Make any changes and update!",
      });
    } else {
      const query = { _id: req.headers.userId, education: prevData };
      const update = { $set: { "education.$": editData } };
      const options = { new: true };

      const addData = await userDb.findOneAndUpdate(query, update, options);
      if (addData) {
        return res.status(200).json({
          updated: true,
          message: "Qualification updated successfully.",
        });
      } else {
        return res.json({
          updated: false,
          message: "somthing error while adding the data!",
        });
      }
    }
  } catch (error) {}
};

//--------------------------------------------------Delete experience----------------------------------------//

export const deleteEducation = async (req, res) => {
  try {
    const prevData = req.body;
    const updated = await userDb.updateOne(
      { _id: req.headers.userId },
      { $pull: { education: prevData } }
    );
    if (updated.modifiedCount === 1) {
      return res.status(200).json({ delete: true, message: "Deleted." });
    } else {
      return res.json({
        delete: false,
        message: "somthing error while delete education!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------------Apply job----------------------------------------//

export const applyJob = async (req, res) => {
  try {
    const { companyId, jobId ,resume} = req.body;
    let resumeUrl = ""
    if(resume){
      resumeUrl = resume
    }else{
    const img = req.file.path;
    const uploadedImage = await uploadToCloudinary(img, "userResume");
    resumeUrl=uploadedImage.url
    }
  

    if (resumeUrl) {
      const applyJobData = new applyJobDb({
        jobId,
        companyId,
        userId: req.headers.userId,
        resume: resumeUrl,
      });
      const savedData = await applyJobData.save();
      if (savedData) {
        const userData = await userDb.findOneAndUpdate(
          { _id: req.headers.userId },
          { $push: { appliedJobs: applyJobData._id } }
        );
        const jobData = await jobDb.findOneAndUpdate(
          { _id: jobId },
          { $push: { appliedUsers: applyJobData._id } }
        );
        const email = userData.email;
        const url = `Your application has been submitted to ${jobData.companyName}.Please await further updates and notifications.`;
        sendMail(
          email,
          `${userData.userName}, Your application to at ${jobData.companyName}.`,
          url
        );
        return res.status(200).json({
          created: true,
          message: `Your application has been submitted to ${jobData.companyName}.`,
        });
      } else {
        return res.json({
          created: false,
          message: "somthing error while apply job ,try sometimes leter!",
        });
      }
    } else {
      return res.json({
        created: false,
        message: "somthing error while apply job ,try sometimes leter!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------------Applied job list----------------------------------------//

export const appliedJobList = async (req, res) => {
  try {
    const { filter, search } = req.query;

    const query = {};
    const query2 = { createdAt: 1 };
    if (filter === "old") {
      query2.createdAt = -1;
    }

    if (search) {
      query.$or = [
        { job_title: { $regex: new RegExp(search, "i") } },
        { job_type: { $regex: new RegExp(search, "i") } },
        { companyName: { $regex: new RegExp(search, "i") } },
      ];
    }

    const userData = await userDb.findOne({ _id: req.headers.userId });
    const appliedJobsId = userData.appliedJobs;
    const application = await applyJobDb.find({ _id: appliedJobsId });
    query._id = { $in: application.map((value) => value.jobId) };
    const appliedJobData = await jobDb.find(query).sort(query2);

    if (appliedJobData) {
      return res
        .status(200)
        .json({ fetched: true, appliedJobData, message: "data fetched!" });
    } else {
      return res.json({
        fetched: false,
        appliedJobData: [],
        message: "somthing error while fetching data!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//---------------------------------------Check currect job applied or not -------------------------------------//

export const checkJobappliedOrNot = async (req, res) => {
  try {
    const { userId, jobId } = req.query;
    const userData = await userDb.findOne({ _id: userId });
    const appliedJobsId = userData.appliedJobs;
    const checkIsApplied = await jobDb.findOne({
      _id: jobId,
      appliedUsers: { $in: appliedJobsId },
    });
    if (checkIsApplied) {
      return res.status(200).json({ data: checkIsApplied, exist: true });
    } else {
      return res.status(400).json({ data: checkIsApplied, exist: false });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------ Check applied job status -------------------------------------//

export const checkJobAppliedStatus = async (req, res) => {
  try {
    const { userId, jobId } = req.query;
    const userData = await userDb.findOne({ _id: userId });
    const applicationId1 = userData.appliedJobs;
    const jobData = await jobDb.findOne({ _id: jobId });
    const applicationId2 = jobData.appliedUsers;

    const commonValuesId = applicationId1.filter((value) =>
      applicationId2.includes(value)
    );
    const application = await applyJobDb.findOne({ _id: commonValuesId });
    const applicationStatus = application.status;

    if (applicationStatus) {
      return res.status(200).json({ application, status: applicationStatus });
    } else {
      return res.status(400).json({ status: applicationStatus });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------ User save jobs -------------------------------------//

export const saveUserJob = async (req, res) => {
  try {
    const exist = await userDb.findOne({
      _id: req.headers.userId,
      savedJobs: { $in: [req.params.jobId] },
    });

    if (exist) {
      return res
        .status(200)
        .json({ saved: false, message: "Job already saved!" });
    } else {
      const userData = await userDb.findOneAndUpdate(
        { _id: req.headers.userId },
        { $push: { savedJobs: req.params.jobId } }
      );
      return res.status(200).json({ saved: true, message: "Job saved." });
    }
  } catch (error) {}
};

//------------------------------------Get User save jobs -------------------------------------//

export const getUserSavedJobs = async (req, res) => {
  try {
    const userData = await userDb.findOne({ _id: req.headers.userId });
    const jobIds = userData.savedJobs;
    const jobsData = await jobDb.find({ _id: jobIds });
    if (jobsData) {
      return res.status(200).json({ data: jobsData });
    } else {
      return res.status(402).json({ data: [] });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------unsave User save jobs -------------------------------------//

export const unSaveJobs = async (req, res) => {
  try {

    const jobData = await userDb.updateOne(
      { _id: req.headers.userId },
      { $pull: { savedJobs: req.params.jobId } }
    );
    if (jobData.modifiedCount === 1) {
      return res.status(200).json({ data: jobData });
    } else {
      return res.status(402).json({ data: [] });
    }
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------Save resume ----------------------------//

export const addResume = async (req, res) => {
  try {
    const img = req.file.path;
    const uploadedImage = await uploadToCloudinary(img, "userResume");
    const lastSlashIndex = uploadedImage.url.lastIndexOf('/');
    const filename = lastSlashIndex !== -1 ? uploadedImage.url.substring(lastSlashIndex + 1) : null;
    if (filename) {
      const resumeAdded = new resumeDb({
        userId:req.headers.userId,
        resume: uploadedImage.url,
        resumeName:filename
      })
      const savedData = await resumeAdded.save();
      const stringId =  String(savedData._id )
      const userData = await userDb.findOneAndUpdate(
        { _id: req.headers.userId },
        { $push: { resumes: stringId } }
      );
      if (userData) {
        return res
          .status(200)
          .json({ created: true, message: "Resume uploaded" });
      } else {
        return res
          .status(200)
          .json({ created: false, message: "Resume uploaded failed!" });
      }
    } else {
      return res
        .status(200)
        .json({ created: false, message: "Resume uploaded failed!" });
    }
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------Delete resume ----------------------------//

export const deleteResume = async (req,res) =>{
 try {
      
       const {resumeId} = req.params
       const deleteFromUser = await userDb.findByIdAndUpdate({_id:req.headers.userId},{$pull:{resumes:resumeId}})
       if(deleteFromUser){
         const resumeData = await resumeDb.findOne({_id:resumeId})
         const resume = resumeData.resume
         const match = resume.match(/\/v\d+\/(.+?)\./);
         const publicId = match ? match[1] : null;
         cloudinary.v2.uploader
         .destroy(publicId)
         .then((res) => console.log("resume image deleted"));
         const deleteResume = await resumeDb.findOneAndDelete({_id:resumeId})
         if(deleteResume){
           return res.status(200).json({deleted:true,message:"deleted."})
         }else{
          return res.status(200).json({deleted:false,message:"Somthing error while deleting."})
         }
       }

 } catch (error) {
  console.log(error);
 }
}

//--------------------------------Delete resume ----------------------------//

export const getUserResumes = async (req,res) =>{
  try {
    const exist = await userDb.findOne({ _id: req.headers.userId });
    const resumeIds = exist.resumes
    const resumesData = await resumeDb.find({_id:resumeIds})
    if(resumesData){
      return res.status(200).json(resumesData)
    }else{
      return res.status(402).json(resumesData)
    }
  } catch (error) {
    console.log(error);
  }
}


