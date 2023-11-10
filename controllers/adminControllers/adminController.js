import userDb from "../../models/userModel.js";

//---------------------------------------Users list-------------------------------------//

export const usersList = async (req, res) => {
  try {
    console.log(req.params,'hghfgh')
    const usersData = await userDb.find();
    if (usersData) {
      return res.status(200).json({ status: true, usersData });
    } else {
      res.json({ message: "Network error" });
    }
  } catch (error) {}
};

//----------------------------------- Users Block or UnBlock ----------------------------------//

export const userBlockOrUnblock = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const user = await userDb.findOne({ _id: id });
    await userDb.findByIdAndUpdate(
      { _id: id },
      { $set: { is_blocked: !user.is_blocked } }
    );
  } catch (error) {}
};
