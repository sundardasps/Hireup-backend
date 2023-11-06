import userDb from "../../models/userModel.js";
import bcrypt from "bcrypt";
import sendMail from "../../utils/sendMails.js";
import jwt from "jsonwebtoken";
import authToken from "../../models/tokenModel.js";
import crypto from "crypto";
import authTokenDb from "../../models/tokenModel.js";
import { log } from "console";
//---------------------------------------------Password hasher----------------------------------------//

const passwordHasher = (password) => {
  const pass = bcrypt.hash(password, 10);
  return pass;
};

//------------------------------------------------User Signin-------------------------------------------//

export const userSignUp = async (req, res) => {
  try {
    const { userName, password, email, number } = req.body;
    const exist = await userDb.findOne({ email: email });
    const hashedpass = await passwordHasher(password);

    if (exist) {
      return res
        .status(200)
        .json({ message: "The email you provided is already registered." });
    } else {
      const user = new userDb({
        userName: userName,
        email,
        password: hashedpass,
        number,
      });
      if (user) {
        const userData = await user.save().then(console.log("user registered"));

        const emailToken = await new authToken({
          userId: userData.id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.FrontEnd_Url}${userData._id}/varification/${emailToken.token}`;
        console.log(url);
        sendMail(email, "Varification mail", url);
        return res.status(200).json({
          created: true,
          message: "Please confirm the email that was sent to your account.",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------User login----------------------------------------//

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await userDb.findOne({ email: email });
    if (exist) {
      const passMatch = await bcrypt.compare(password, exist.password);
      if (passMatch) {
        const jwtToken = jwt.sign({ exist }, process.env.jwtSecretKey, {
          expiresIn: "30d",
        });
        return res.status(200).json({
          loginData: exist,
          loginSuccess: true,
          message: "Login Successfully",
          jwtToken,
        });
      } else {
        res.json({
          message: "The password you entered is incorrect.",
        });
      }
    } else {
      res.json({ message: "The entered email addresses do not match." });
    }
  } catch (error) {
    console.log(error);
  }
};

//---------------------------------------------Email Varification----------------------------------------//

export const userVarification = async (req, res) => {
  try {
    const {email}  = req.body.values
    const varified = await userDb.findOne({email: email});
    if (varified) {
      const tokenCheck = await authTokenDb.findOne({ token: req.body.token });
      if (tokenCheck) {
        await userDb.findOneAndUpdate(
          { _id: req.body.userId },
          { $set: { is_varified: true } }
        );
        await tokenCheck.deleteOne({ token: req.body.token });
        return res
          .status(200)
          .json({ loginSuccess: true, message: "Login successfully" });
      } else {
        return res.json({
          loginSuccess: false,
          message: "The link you clicked is not valid.",
        });
      }
    } else {
      return res.json({
        loginSuccess: false,
        message: "The entered email addresses do not match.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//---------------------------------------------Forget password----------------------------------------//

export const forgetPassword = async (req, res) => {
  try {
    const exist = await userDb.findOne({ email: req.body.email });
    if (!exist) {
      return res
        .status(400)
        .json({ message: "The entered email addresses do not match." });
    } else {
      if (!exist.is_varified) {
        return res
          .status(400)
          .json({ message: "Your account has yet to be verified." });
      } else {
        const emailToken = await new authToken({
          userId: exist._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.FrontEnd_Url}${exist._id}/resetPassword/${emailToken.token}`;
        console.log(url);
        sendMail(exist.email, "Reset password", url);
        return res.status(200).json({
          created: true,
          message: "Please confirm the email that was sent to your account.",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//---------------------------------------------Reset password----------------------------------------//

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body.values;
    const hashedPassword = await passwordHasher(password);
    const validLink = await authTokenDb.findOne({ userId: req.body.userId });

    if (validLink.token == req.body.token) {
      await authTokenDb.deleteOne({ userId: req.body.userId });
      const updated = await userDb.findByIdAndUpdate(
        { _id: req.body.userId },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );

      if (updated) {
        return res
          .status(200)
          .json({ reseted: true, message: "Your password reseted" });
      } else {
        return res.status(400).json({
          reseted: false,
          message: "An error occurred during the reset process.",
        });
      }
    } else {
      return res
        .status(400)
        .json({ message: "The link you clicked is not valid." });
    }
  } catch (error) {
    console.log(error);
  }
};
