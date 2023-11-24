import companyDb from "../../models/companyModel.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { tokenJwt } from "../../utils/authTokens.js";
import jobDb from "../../models/companyPostModel.js";
import cloudinary from "cloudinary/lib/cloudinary.js";
import { set } from "mongoose";

//------------------------------------------ Company fulldetails adding ----------------------------------------//

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
    const userData = await companyDb.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          address: companyAddress,
          image: uploadedImage.url,
          location: companyLocation,
          company_roles: companyRoles,
          gst_number: gstNumber,
          is_completed: true,
          companyName,
          size,
        },
      }
    );
    const jwtToken = tokenJwt(userData);
    if (userData) {
      return res.status(200).json({ userData, updated: true, jwtToken });
    } else {
      return res
        .status(200)
        .json({ userData, updated: false, message: "Somthing error!" });
    }
  } catch (error) {}
};

//------------------------------------------ Company Post adding  ----------------------------------------//

export const companyAddPost = async (req, res) => {
  try {
    const {
      jobType,
      jobPosition,
      experience,
      skills,
      responsibilities,
      endTime,
      salery,
    } = req.body;
    const id = req.headers.comapnyId;

    const saveData = await jobDb({
      job_title: jobPosition,
      required_skills: skills,
      experience: experience,
      job_type: jobType,
      responsibilities: responsibilities,
      end_time: endTime,
      salery: salery,
    });
    const companyData = await saveData.save();
    if (companyData) {
      const jobId = companyData._id;
      const stringJobId = jobId.toString();
      const data = await companyDb.findOneAndUpdate(
        { id: id },
        { $push: { jobs: stringJobId } }
      );
      if (data) {
        return res
          .status(200)
          .json({ created: true, message: "Post saved successfully" });
      } else {
        return res.status(200).json({
          created: false,
          message: "Somthing error while saving jobs",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ Company get posts ----------------------------------------//

export const getPostCompany = async (req, res) => {
  try {
    const { search, filter, page } = req.query;

    let query = { is_active: true };
    if (filter === "Active") {
      query.is_active = true;
    } else if (filter === "Expired") {
      query.is_active = false;
    }
    if (search) {
      query.job_title = { $regex: new RegExp(search, "i") };
    }

    let limit = 4;
    let skip = (page - 1) * 4;

    const companyData = await companyDb.findOne({ _id: req.headers.companyId });
    const jobs = companyData.jobs;

    const count = await jobDb.find().countDocuments();
    let totalPage = Math.ceil(count / limit);
    const Fulldetails = await jobDb
      .find({ _id: { $in: jobs }, ...query })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

 

    if (Fulldetails.length > 0) {
      return res.status(200).json({
        fetched: true,
        data: Fulldetails,
        totalPage,
        count,
        companyData,
      });
    } else {
      res
        .status(200)
        .json({ fetched: false, data: [], totalPage, count, companyData });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//------------------------------------------ Company get postsfulldetails ----------------------------------------//

export const jobFullDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const jobDetails = await jobDb.findOne({ _id: id });

    if (jobDetails) {
      return res
        .status(200)
        .json({ fetched: true, jobDetails, message: "Details fetched!" });
    } else {
      return res.json({
        fetched: false,
        jobDetails,
        message: "Something error while fetching data",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ Company edit profile ----------------------------------------//

export const editeProfile = async (req, res) => {
  try {
    const {
      companyName,
      email,
      companyLocation,
      companyAddress,
      size,
      gstNumber,
      companyRoles,
      number,
    } = req.body;
    const updated = await companyDb.findOneAndUpdate(
      { _id: req.headers.companyId },
      {
        $set: {
          number: number,
          companyName: companyName,
          email: email,
          role: companyRoles,
          location: companyLocation,
          address: companyAddress,
          gst_number: gstNumber,
          size: size,
        },
      }
    );
    if (updated) {
      return res
        .status(200)
        .json({ updated: true, message: "Profile updated successfully!" });
    } else {
      return res
        .status(200)
        .json({ updated: false, message: "Profile updation failed" });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ Company profile ----------------------------------------//

export const getCompanyProfile = async (req, res) => {
  try {
    const exist = await companyDb.findOne({ _id: req.headers.companyId });
    if (exist) {
      return res.status(200).json({ fetched: true, exist });
    } else {
      return res.json({ fetched: false, exist });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ Company profile image edit ----------------------------------------//

export const editeProfileImage = async (req, res) => {
  try {
    const companyData = await companyDb.findOne({ _id: req.headers.companyId });
    const prevImage = companyData.image;
    const match = prevImage.match(/\/v\d+\/(.+?)\./);
    const publicId = match ? match[1] : null;

    const img = req.file.path;
    const uploadedImage = await uploadToCloudinary(img, "companyDp");
    const updateData = await companyDb.findOneAndUpdate({
      image: uploadedImage.url,
    });

    if (updateData) {
      cloudinary.v2.uploader
        .destroy(publicId)
        .then((res) => console.log("prev image deleted"));

      return res
        .status(200)
        .json({ updated: true, message: "Image updated successfully!" });
    } else {
      return res
        .status(200)
        .json({
          updated: false,
          message: "somthing error while updating image!",
        });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ Company Post edit ----------------------------------------//

export const editPost = async (req, res) => {
  try {
    const {
      jobPosition,
      skills,
      experience,
      jobType,
      responsibilities,
      endTime,
      salery,
    } = req.body;
    const updated = await jobDb.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          job_title: jobPosition,
          required_skills: skills,
          experience: experience,
          job_type: jobType,
          responsibilities: responsibilities,
          end_time: endTime,
          salery: salery,
        },
      }
    );
    if (updated) {
      return res
        .status(200)
        .json({ updated: true, message: "Post updated successfully!" });
    } else {
      return res
        .status(200)
        .json({ updated: false, message: "Something error while updation!" });
    }
  } catch (error) {}
};
