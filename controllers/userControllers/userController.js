import userDb from "../../models/userModel.js";
import categoryDb from "../../models/categoryModel.js";
import jobDb from "../../models/companyPostModel.js";
import cloudinary from "cloudinary/lib/cloudinary.js";
import companyDb from "../../models/companyModel.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import applyJobDb from "../../models/jobApply.js";
import sendMail from "../../utils/sendMails.js";
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

    const { search, filter } = req.query;

    let query = { is_delete: false };

    if (search) {
      query.$or = [
        { job_title: { $regex: new RegExp(search, "i") } },
        { companyName: { $regex: new RegExp(search, "i") } },
        { companyLocation: { $regex: new RegExp(search, "i") } },
        { job_type: { $regex: new RegExp(search, "i") } },
      ];
    }

    if (filter) {
      query.job_title = { $regex: new RegExp(filter, "i") };
    }

    const allJobs = await jobDb.find(query).sort({ createdAt: -1 });

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
    let total = 0;
    if (exist && exist.experience) {
      exist.experience.forEach((value, index) => {
        total = total + Number(value.match(/\d+/g));
      });
    }
    if (exist) {
      return res.status(200).json({ fetched: true, exist, total });
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
    console.log(typeof trimmedExperience);
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
    const { companyId, jobId } = req.body;
    const img = req.file.path;
    const uploadedImage = await uploadToCloudinary(img, "userResume");
    if (uploadToCloudinary) {
      const applyJobData = new applyJobDb({
        jobId,
        companyId,
        userId: req.headers.userId,
        resume: uploadedImage.url,
      });
      const savedData = await applyJobData.save();
      if (savedData) {
        const userData = await userDb.findOneAndUpdate(
          { _id: req.headers.userId },
          { $push: { appliedJobs: jobId } }
        );
        const jobData = await jobDb.findOneAndUpdate(
          { _id: jobId },
          { $push: { appliedUsers: req.headers.userId } }
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
