import userDb from "../../models/userModel.js";
import categoryDb from "../../models/categoryModel.js";
import jobDb from "../../models/companyPostModel.js";

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
    console.log(exist);
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
    console.log(req.headers.userId);
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
