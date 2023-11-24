import userDb from "../../models/userModel.js";
import categoryDb from "../../models/categoryModel.js";

export const getCategory = async (req, res) => {
  try {;
    const categoryData = await categoryDb.find({ is_active: true });
    if (categoryData) {
      return res.status(200).json({ status: true, data: categoryData });
    } else {
      res.json({ message: "Network error" });
    }
  } catch (error) {}
};
