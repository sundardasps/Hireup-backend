import companyDb from "../../models/companyModel.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { tokenJwt } from "../../utils/authTokens.js";
import jobDb from "../../models/companyPostModel.js";
import cloudinary from "cloudinary/lib/cloudinary.js";
import userDb from "../../models/userModel.js";
import categoryDb from "../../models/categoryModel.js";
import userApplicationDb from "../../models/jobApply.js";
import sendMail from "../../utils/sendMails.js";
import intervieweDb from "../../models/InterviewModel.js";
import stripe from "stripe";

//------------------------------------------ Company fulldetails adding ----------------------------------------//

export const addcompanyFullDetails = async (req, res,next) => {
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
          is_completed: 1,
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
  } catch (error) {
    console.log(error);
    next()
  }
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
      salery,field,
    } = req.body;
    console.log(req.body,"kkkkkkkkkk");
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
      field,
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

export const getPostCompany = async (req, res,next) => {
  try {
    const allJobs = await jobDb.find({ is_delete: false });
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

    let query = { is_active: true };
    query = { is_delete: false };

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
    next()
  }
};

//------------------------------------------ Company get postsfulldetails ----------------------------------------//

export const jobFullDetails = async (req, res,next) => {
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
    next(error)
  }
};

//------------------------------------------ Company edit profile ----------------------------------------//

export const editeProfile = async (req, res,next) => {
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

export const getCompanyProfile = async (req, res,next) => {
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

export const editeProfileImage = async (req, res,next) => {
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

export const editPost = async (req, res,next) => {
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

export const getUserList = async (req, res,next) => {
  try {
    const { search, filter, page } = req.query;

    let query = { is_blocked: false };

    if (search) {
      query.$or = [
        { userName: { $regex: new RegExp(search, "i") } },
        { userTitle: { $regex: new RegExp(search, "i") } },
      ];
    }

    if (filter) {
      query.userTitle = { $regex: new RegExp(filter, "i") };
    }

    let limit = 8;
    const skip = (page - 1) * limit;
    let count = await userDb.find().countDocuments();
    let totalPage = Math.ceil(count / limit);
    const userList = await userDb.find(query).skip(skip).limit(limit);
    if (userList) {
      return res.status(200).json({ fetched: true, userList, totalPage });
    } else {
      return res.status(200).json({ fetched: false, userList: [] });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ Company details check ----------------------------------------//

export const checkCompleted = async (req, res,next) => {
  try {
    const profile = await companyDb.findOne({ _id: req.headers.companyId });
    const completed = profile.is_completed;

    if (profile) {
      return res.status(200).json({ completed });
    }
  } catch (error) {}
};

//------------------------------------------ Company post delete ----------------------------------------//

export const deleteJob = async (req, res,next) => {
  try {
    const id = req.params.id;
    const deleted = await jobDb.findOneAndUpdate(
      { _id: id },
      { $set: { is_delete: true } }
    );
    if (deleted) {
      return res.status(200).json({ updated: true, message: "Deleted." });
    } else {
      return res.json({
        updated: false,
        message: "Something error while deletion!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ Get all category ----------------------------------------//

export const getCategory = async (req, res,next) => {
  try {
    const categoryData = await categoryDb.find({ is_active: true });
    if (categoryData) {
      return res.status(200).json({ status: true, data: categoryData });
    } else {
      res.json({ message: "Network error" });
    }
  } catch (error) {}
};

//------------------------------------------ Get user details ----------------------------------------//

export const getUserDetails = async (req, res,next) => {
  try {
    const userData = await userDb.findOne({ _id: req.params.id });
    let total = 0;
    if (userData && userData.experience) {
      userData.experience.forEach((value, index) => {
        total = total + Number(value.match(/\d+/g));
      });
    }

    if (userData) {
      return res
        .status(200)
        .json({ fetched: true, total, userData, message: "Data fetched!" });
    } else {
      return res.json({ fetched: false, userData, message: "Data fetched!" });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ Get applied user ----------------------------------------//

export const getAppliedUsers = async (req, res,next) => {
  try {
    const { jobId, search, filter } = req.query;
    let query = {};

    if (search) {
      query.userName = { $regex: new RegExp(search, "i") };
    }
    const jobData = await jobDb.findOne({ _id: jobId });

    const usersIdAggregation = await userApplicationDb.aggregate([
      {
        $match: {
          jobId: jobId,
          status: filter ? filter : { $in: ["viewed", "submitted"] },
        },
      },
      {
        $group: {
          _id: null,
          userIds: {
            $push: "$userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          userIds: 1,
        },
      },
    ]);

    query._id = usersIdAggregation[0] ? usersIdAggregation[0].userIds : [];
    const usersData = await userDb.find(query);
    if (usersData) {
      return res.status(200).json({
        fetched: true,
        usersData,
        jobTitle: jobData.job_title,
        message: "Data fetched!",
      });
    } else {
      return res.json({ fetched: false, message: "Data fetched!" });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ Get Single User JobApplication ----------------------------------------//

export const getSingleUserApplication = async (req, res,next) => {
  try {
    const { userId, jobId } = req.body;

    const userData = await userDb.findOne({ _id: userId });
    const applicationsId = userData.appliedJobs;
    const jobApplication = await userApplicationDb.findOneAndUpdate(
      {
        _id: applicationsId,
        userId,
        jobId,
      },
      { $set: { status: "viewed" } }
    );
    let resumeType = "";

    if (jobApplication.resume) {
      const image = jobApplication.resume;
      const array = image.split(".").reverse();
      resumeType = array[0];
    }

    if (jobApplication) {
      return res.status(200).json({
        fetched: true,
        jobApplication,
        resumeType,
        message: "Data fetched!",
      });
    } else {
      return res.json({
        fetched: false,
        jobApplication,
        resumeType,
        message: "Data fetched!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ JobApplication reject ----------------------------------------//

export const rejectUserApplication = async (req, res,next) => {
  try {
    const { userId, jobId } = req.body;
    const userData = await userDb.findOne({ _id: userId });
    const applicationsId = userData.appliedJobs;
    const jobApplication = await userApplicationDb.findOneAndUpdate(
      {
        _id: applicationsId,
        userId,
        jobId,
      },
      { $set: { status: "rejected" } }
    );

    if (jobApplication) {
      const userRejected = await jobDb.findOneAndUpdate(
        { _id: jobId },
        { $pull: { appliedUsers: userId } }
      );
      const emailContent = `Dear ${userData.userName},
         Thank you for applying for ${userRejected.job_title} at ${userRejected.companyName}. 
         After careful review, we've can't move with your application now.
         We appreciate your interest and wish you success in your job search.
         best regards,
         ${userRejected.companyName}
     `;
      sendMail(userData.email, "Hireup", emailContent);
      if (userRejected) {
        return res.status(200).json({
          reject: true,
          message: `${userData.userName}'s, application rejected succesfully.`,
        });
      } else {
        return res.status(500).json({
          reject: false,
          message: `Something error while rejecting ${userData.userName}'s, application`,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ schedule interview ----------------------------------------//

export const scheduleInterview = async (req, res,next) => {
  try {
    const {
      values: { interviewer, type, date, requirement },
      userId,
      jobId,
    } = req.body;
    const exist = await intervieweDb.findOne({ userId, jobId });
    console.log(exist);
    if (exist) {
      return res.json({
        created: false,
        message: "The interview for this position is already scheduled!",
      });
    } else {
      const userData = await userDb.findOne({ _id: userId });
      const applicationsId = userData.appliedJobs;
      const application = await userApplicationDb.findOneAndUpdate(
        {
          _id: applicationsId,
          userId,
          jobId,
        },
        { $set: { status: "sheduled" } }
      );
      const jobData = await jobDb.findOne({ _id: jobId });
      const inrterview = await intervieweDb({
        date,
        type,
        jobId,
        userId,
        interviewer,
        userDp: userData.userDp,
        userNumber: userData.number,
        userEmail: userData.email,
        userTitle: userData.userTitle,
        requirements: requirement,
        userName: userData.userName,
        applicationId: application._id,
      });
      const savedInterview = await inrterview.save();
      if (savedInterview) {
        let content = `Dear ${userData.userName},

          We are pleased to inform you that you have been selected for an HR interview for the ${jobData.job_title} position at ${jobData.companyName}. Your application was reviewed by ${interviewer} on ${date}. Please prepare for the interview, taking note of the preferred requirements outlined.
          
          Here are the details for the interview: ${requirement}.
          
          Best regards,
          ${jobData.companyName}
        `;
        sendMail(userData.email, "HireUp interview scheduled", content);
        return res.status(200).json({
          created: true,
          message: "Interview scheduled successfully..",
        });
      } else {
        return res
          .status(402)
          .json({ created: false, message: "Something error while deletion!" });
      }
    }
  } catch (error) {}
};

//------------------------------------------ scheduled interview list ----------------------------------------//

export const getsheduledInterviews = async (req, res,next) => {
  try {
    const companyData = await companyDb.findOne({ _id: req.headers.companyId });
    const jobIds = companyData.jobs;
    const interviewsList = await intervieweDb.find({ jobId: { $in: jobIds } });

    if (interviewsList) {
      return res.status(200).json({ list: interviewsList });
    } else {
      return res.status(403).json({ list: [] });
    }
  } catch (error) {}
};

//------------------------------------------ schedule interview ----------------------------------------//

export const reScheduleInterview = async (req, res,next) => {
  try {
    const {
      values: { interviewer, type, date, requirement },
      userId,
      jobId,
      interviewId,
    } = req.body;
    console.log(req.body);

    const userData = await userDb.findOne({ _id: userId });
    const jobData = await jobDb.findOne({ _id: jobId });
    const inrterview = await intervieweDb.findOneAndUpdate(
      { _id: interviewId },
      { $set: { date, type, interviewer, requirements: requirement } }
    );

    if (inrterview) {
      let content = `Dear ${userData.userName},

          We are pleased to inform you that you have been made some updates for an HR interview for the ${jobData.job_title} position at ${jobData.companyName}. Your application was reviewed by ${interviewer} on ${date}. Please prepare for the interview, taking note of the preferred requirements outlined.
          
          Here are the details for the interview: ${requirement}.
          
          Best regards,
          ${jobData.companyName}
        `;
      sendMail(userData.email, "HireUp interview updated", content);
      return res.status(200).json({
        updated: true,
        message: "Interview ReScheduled successfully..",
      });
    } else {
      return res
        .status(402)
        .json({ updated: false, message: "Something error while updation!" });
    }
  } catch (error) {}
};

//------------------------------------------ Stripe payment ----------------------------------------//

export const stripePaymentInstance = async (req, res,next) => {
  try {

    const { price } = req.body;
    const subscriptionType = price.interval
    const clientId = req.headers.companyId;
    const stripeInstence = stripe(
      "sk_test_51OPm1SSEvDV8XVWTIhyCIMDhqJw8ueWYd8F26axdF8DYEdzff7hWU9f1dOsybJF5yHtw3VWvcBlbEyRaw7N6ZelB00EfrGJRnD"
    );

    const session = await stripeInstence.checkout.sessions.create({
      billing_address_collection: 'auto',

      line_items: [
        {
          price: price.id,
          quantity: 1,
            
        },
      ],
      mode: 'subscription',
      success_url:`http://localhost:5173/company/status`,
      cancel_url: `http://localhost:5173/company/status`,
      // success_url:`http://localhost:5173/company/status?success=true&session_id=${subscriptionType}`,
      // cancel_url: `http://localhost:5173/company/status?canceled=true`,
    })
    console.log(session,"[[[[");
    res.status(200).json({ session });
  } catch (error) {
    console.log(error);
    next(error)
  }
};
