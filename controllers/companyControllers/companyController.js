import companyDb from "../../models/companyModel.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { tokenJwt } from "../../utils/authTokens.js";
import jobDb from "../../models/companyPostModel.js";
import cloudinary from "cloudinary/lib/cloudinary.js";
import userDb from "../../models/userModel.js";
import categoryDb from "../../models/categoryModel.js"

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
          is_completed:1,
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
    const id = req.headers.companyId;
    const company = await companyDb.findOne({ _id: id });

    const saveData = await jobDb({
      job_title: jobPosition,
      required_skills: skills,
      experience: experience,
      job_type: jobType,
      responsibilities: responsibilities,
      end_time: endTime,
      salery: salery,
      companyName: company.companyName,
      companyImage: company.image,
      companyLocation: company.location,
      companyId: id,
    });
    const companyData = await saveData.save();
    if (companyData) {
      const jobId = companyData._id;
      const stringJobId = jobId.toString();

      const data = await companyDb.findOneAndUpdate(
        { _id: id },
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

    const allJobs = await jobDb.find({is_delete:false});
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    allJobs.forEach(async (value) => {
      if (value.end_time < formattedDate) {
        await jobDb.findOneAndUpdate(
          { _id: value._id },
          { $set: { is_active: false } }
        );
      }
    });

    const { search, filter, page } = req.query;
    
    let query = {is_active:true};
        query = {is_delete:false};

    if (filter === "Active") {
      query.is_active = true;
    } else if (filter === "Expired") {
      query.is_active = false;
    }

    if (search) {
      query.$or = [
        { job_title: { $regex: new RegExp(search, "i") } },
        { job_type: { $regex: new RegExp(search, "i") } },
        { companyLocation: { $regex: new RegExp(search, "i") } },
        { companyName: { $regex: new RegExp(search, "i") } },
      ];
    }

    let limit = 3;
    let skip = (page - 1) * limit;

    const companyData = await companyDb.findOne({ _id: req.headers.companyId });

    const jobs = companyData.jobs;

    const count = await jobDb
      .find({ _id: { $in: jobs }, ...query })
      .countDocuments();

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
        .json({ fetched: false, data: [], totalPage: 0, count, companyData });
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
    const updateData = await companyDb.findOneAndUpdate(
      { _id: req.headers.companyId },
      {
        image: uploadedImage.url,
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

//------------------------------------------ Company get Users ----------------------------------------//

export const getUserList = async (req, res) => {
  try {
    const { search , filter } = req.query;

    let query = { is_blocked: false };

    if (search) {
      query.$or = [
        {userName :{ $regex: new RegExp(search, "i") }},
        {userTitle :{ $regex: new RegExp(search, "i") }}

      ]
    }
    if(filter){
      query.userTitle = {$regex:new RegExp(filter,"i")}
    }

    const userList = await userDb.find(query);
    if (userList) {
      return res.status(200).json({ fetched: true,  userList });
    } else {
      return res.status(200).json({ fetched: false, userList: [] });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ Company details check ----------------------------------------//

export const checkCompleted = async (req, res) => {
  try {
    const profile = await companyDb.findOne({ _id: req.headers.companyId });
    const completed = profile.is_completed;
    console.log(completed);
    if (profile) {
      return res.status(200).json({ completed });
    }
  } catch (error) {}
};

//------------------------------------------ Company post delete ----------------------------------------//

export const deleteJob = async (req,res) =>{
  try{
      const id = req.params.id
      const deleted = await jobDb.findOneAndUpdate({_id:id},{$set:{is_delete:true}})
      if(deleted){
        return res.status(200).json({updated:true , message : "Deleted."})
      }else{
        return res.json({updated:false , message : "Something error while deletion!"})
      }
  } catch (error) {
    console.log(error);
  }

}

//------------------------------------------ Get all category ----------------------------------------//

export const getCategory = async (req, res) => {
  try {
    const categoryData = await categoryDb.find({ is_active: true });
    if (categoryData) {
      return res.status(200).json({ status:true, data: categoryData });
    } else {
      res.json({ message: "Network error" });
    }
  } catch (error) {}
};