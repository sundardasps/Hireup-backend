import userDb from "../../models/userModel.js";
import companyDb from "../../models/companyModel.js";
import categoryDb from "../../models/categoryModel.js";

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
    console.log(id, "=================================================");
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
    const exist = await categoryDb.findOne({ title: title });
    if (exist) {
      return res
        .status(200)
        .json({ created: false, message: "This title already added!" });
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



