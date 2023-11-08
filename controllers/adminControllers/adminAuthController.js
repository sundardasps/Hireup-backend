import userDb from "../../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await userDb.findOne({ email: email });
    if (exist) {
        if (exist.is_admin) {
            const checkedPass = await bcrypt.compare(password, exist.password);
            if (checkedPass) {
                const jwtToken = jwt.sign({ exist }, process.env.jwtSecretKey, {
                    expiresIn: "30d",
                });
        return   res
            .status(200)
            .json({ loginData: exist, loginSuccess: true, jwtToken });
        } else {
           return  res.json({message:"Entered password incorrect"})
        }
      } else {
       return  res.json({
          message: "Enterd email not have the permission for admin login",
        });
      }
    } else {
      return res.json({ message: "Entered email not registered" });
    }
  } catch (error) {}
};

//---------------------------------------Users list-------------------------------------//

