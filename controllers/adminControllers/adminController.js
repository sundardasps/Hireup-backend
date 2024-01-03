import userDb from "../../models/userModel.js";
import companyDb from "../../models/companyModel.js";
import categoryDb from "../../models/categoryModel.js";
import jobDb from "../../models/companyPostModel.js"
import applicationDb from "../../models/jobApply.js"

import { query } from "express";

//=====================================Users section====================================//

//----------------------Users list-------------------//

export const usersList = async (req, res) => {
  try {
    const { page, search, filter } = req.query;

    let query = { is_admin: false };

    if (filter === "Active") {
      query.is_blocked = false;
    } else if (filter === "Blocked") {
      query.is_blocked = true;
    }
    if (search) {
      query.userName = { $regex: new RegExp(search, "i") };
    }

    let limit = 4;
    let skip = (page - 1) * 4;
    const count = await userDb.find().countDocuments();
    let totalPage = Math.ceil(count / limit);
    const userData = await userDb.find(query).skip(skip).limit(limit);

    if (userData) {
      return res
        .status(200)
        .json({ status: true, data: userData, count, totalPage });
    } else {
      res.json({ message: "Network error" });
    }
  } catch (error) {}
};

//---------------- Users Block or UnBlock -------------------//

export const userBlockOrUnblock = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userDb.findOne({ _id: id });
    const updated = await userDb.findByIdAndUpdate(
      { _id: id },
      { $set: { is_blocked: !user.is_blocked } }
    );
    if (updated) {
      return res.status(200).json({ updated: true });
    } else {
      return res.status(200).json({ updated: false });
    }
  } catch (error) {}
};

//=====================================Companies section====================================//

//----------------------Companies list-------------------//

export const companiesList = async (req, res) => {
  try {
    const { page, search, filter } = req.query;
    let query = { is_admin: false };

    if (filter === "Active") {
      query.is_blocked = false;
    } else if (filter === "Blocked") {
      query.is_blocked = true;
    }
    if (search) {
      query.companyName = { $regex: new RegExp(search, "i") };
    }

    let limit = 4;
    let skip = (page - 1) * 4;
    const count = await companyDb.find().countDocuments();
    let totalPage = Math.ceil(count / limit);
    const companiesData = await companyDb.find(query).skip(skip).limit(limit);

    if (companiesData) {
      return res
        .status(200)
        .json({ status: true, data: companiesData, count, totalPage });
    } else {
      res.json({ message: "Network error" });
    }
  } catch (error) {}
};

//---------------- Companies Block or UnBlock -------------------//

export const companyBlockOrUnblock = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await companyDb.findOne({ _id: id });
    const updated = await companyDb.findByIdAndUpdate(
      { _id: id },
      { $set: { is_blocked: !company.is_blocked } }
    );
    if (updated) {
      return res.status(200).json({ updated: true });
    } else {
      return res.status(200).json({ updated: false });
    }
  } catch (error) {}
};

//=====================================Category section====================================//

//---------------- Adding category title -------------------//

export const addCategoryTitle = async (req, res) => {
  try {
    const { title } = req.body;

    const exist = await categoryDb.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });
    if (exist) {
      return res.json({ created: false, message: "This title already added!" });
    } else {
      const categoryTitle = new categoryDb({
        title,
      });
      const savedTitle = await categoryTitle.save();
      if (savedTitle) {
        return res
          .status(200)
          .json({ created: true, message: "Title added successfully" });
      }
    }
  } catch (error) {}
};

//---------------- Getting category title -------------------//

export const getCategoryTitle = async (req, res) => {
  try {
    const titlesData = await categoryDb.find();
    if (titlesData) {
      return res
        .status(200)
        .json({ titlesData, dataFetched: true, message: "Data fetched!" });
    } else {
      return res.status(200).json({
        titlesData: [],
        dataFetched: false,
        message: "Error while fetching data",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//---------------- Adding category  -------------------//

export const addCategory = async (req, res) => {
  try {
    const { category, title } = req.body;
    const data1 = await categoryDb.findOne({ category: { $in: [category] } });
    if (data1) {
      return res.json({
        created: false,
        message: "The category has already added",
      });
    } else {
      const data = await categoryDb.findByIdAndUpdate(
        { _id: title },
        { $push: { category: category } }
      );
      if (data) {
        return res
          .status(200)
          .json({ created: true, message: "Category added successfully" });
      }
    }
  } catch (error) {}
};

//---------------- getting category title list -------------------//

export const categoryList = async (req, res) => {
  try {
    const { page, search, filter } = req.query;
    let query = { is_active: true };
    if (filter === "Active") {
      query.is_active = true;
    } else if (filter === "Blocked") {
      query.is_active = false;
    }
    if (search) {
      query.title = { $regex: new RegExp(search, "i") };
    }

    let limit = 4;
    let skip = (page - 1) * 4;
    const count = await categoryDb.find().countDocuments();
    let totalPage = Math.ceil(count / limit);
    const categoryData = await categoryDb.find(query).skip(skip).limit(limit);
    if (categoryData) {
      return res
        .status(200)
        .json({ status: true, data: categoryData, count, totalPage });
    } else {
      res.json({ message: "Network error" });
    }
  } catch (error) {}
};

//---------------- Category block or unblock -------------------//

export const titleBlockorUnblock = async (req, res) => {
  try {
    const id = req.params.id;
    const exist = await categoryDb.findOne({ _id: id });
    if (exist) {
      const updatedData = await categoryDb.findOneAndUpdate(
        { _id: id },
        { $set: { is_active: !exist.is_active } }
      );

      if (updatedData) {
        return res.status(200).json({ updated: true });
      } else {
        return res
          .status(200)
          .json({ updated: false, message: "Somthing error" });
      }
    }
  } catch (error) {}
};

//---------------- Sub category delete -------------------//

export const deleteSubcategory = async (req, res) => {
  try {
    const { value, id } = req.body;
    const trimmedSubcategory = value.trim();
    console.log(typeof trimmedExperience);
    const updated = await categoryDb.updateOne(
      { _id: id },
      { $pull: { category: value } }
    );
    console.log(updated);
    if (updated.modifiedCount === 1) {
      return res.status(200).json({ update: true, message: "Deleted" });
    } else {
      return res.json({
        update: false,
        message: "somthing error while delete subcategory!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//---------------- Get dashboard -------------------//

export const getDashboard = async (req, res) => {
  try { 

     let company = {}
     const activecompaniesCount = await companyDb.find({is_blocked:false}).count()
     const activeJobs = await jobDb.find({is_active:true}).count()
     const applications = await applicationDb.find({$or:[{status:"submitted"},{status:"viewed"}]}).count()
     const activeUsers = await userDb.find({is_blocked:false}).count()
     
     return res.status(200).json({
      activecompaniesCount,activeJobs,applications,activeUsers
     })


  } catch (error) {
    console.log(error);
  }
};

//---------------- Get approved-------------------//
export const approveComapny  = async (req,res) =>{

  try {
    const companyData = await companyDb.findOne({_id:req.params.id})
    const prevState = companyData.is_approved
    const approveOrnot = await companyDb.findOneAndUpdate({_id:req.params.id},{$set:{is_approved:!prevState}})
    if(approveOrnot.is_approved === true){
      return res.status(200).json({approved:true,message:"Company approved"})
    }else{
      return res.status(200).json({approved:false,message:"Approvel canceled"})
    }
  } catch (error) {
     console.log(error);    
  }

}
