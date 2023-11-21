import companyDb from "../../models/companyModel.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { tokenJwt } from "../../utils/authTokens.js";
import postDb from "../../models/companyPostModel.js";
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

    const saveData = await postDb({
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
        res
          .status(200)
          .json({ created: true, message: "Post saved successfully" });
      } else {
        res
          .status(200)
          .json({
            created: false,
            message: "Somthing error while saving jobs",
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
