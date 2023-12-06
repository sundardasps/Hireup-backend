import companyDb from "../../models/companyModel.js";
import bcrypt from "bcrypt";
import authTokenDb from "../../models/tokenModel.js";
import crypto from "crypto";
import sendMail from "../../utils/sendMails.js";
import jwt from "jsonwebtoken";
import { passwordHasher, tokenJwt } from "../../utils/authTokens.js";

//---------------------------------------- Register ----------------------------------------//

export const companyRegister = async (req, res) => {
  try {
    const { companyName, number, email, password } = req.body;
    const exist = await companyDb.findOne({ email: email });
    const hashedpass = await passwordHasher(password);

    if (exist) {
      return res
        .status(200)
        .json({ message: "The email you provided is already registered." });
    } else {
      const user = new companyDb({
        companyName: companyName,
        email,
        password: hashedpass,
        number,
      });
      if (user) {
        const companyData = await user
          .save()
          .then(console.log("user registered"));

        const emailToken = await new authTokenDb({
          companyId: companyData.id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.FrontEnd_Url}company/${companyData._id}/varification/${emailToken.token}`;
        console.log(url);
        sendMail(email, "Company Varification mail", url);
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

//----------------------------------------- Varification ----------------------------------------//

export const companyVarification = async (req, res) => {
  try {
    const { email } = req.body.values;
    const exist = await companyDb.findOne({ email: email });
    if (exist) {
      const checkToken = await authTokenDb.findOne({ token: req.body.token });
      if (checkToken) {
        const varifiy = await companyDb.findByIdAndUpdate(
          { _id: req.body.companyId },
          { $set: { is_varified: true } }
        );
        if (varifiy) {
          await authTokenDb.deleteOne({ token: req.body.token });
          return res.status(200).json({
            varification: true,
            message: "Your account verified success fully",
          });
        } else {
          return res.json({
            message: "The database server is unreachable.",
          });
        }
      } else {
        return res.json({ message: "The link you clicked is not valid." });
      }
    } else {
      return res.json({
        message: "The entered email addresses do not match.",
      });
    }
  } catch (error) {}
};

//------------------------------------------ Login ----------------------------------------//

export const companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await companyDb.findOne({ email: email });
    if (exist) {
      if (exist.is_blocked === true) {
        return res.json({
          loginSuccess: false,
          message: "user where blocked by admin!",
        });
      } else {
        const passwordCheck = await bcrypt.compare(password, exist.password);
        if (passwordCheck) {
          if (exist.is_varified || exist.is_google) {
            const jwtToken = tokenJwt(exist);
            return res.status(200).json({
              loginData: exist,
              jwtToken,
              message: "Logined successfully",
              loginSuccess: true,
            });
          } else {
            const emailToken = await new authTokenDb({
              companyId: exist._id,
              token: crypto.randomBytes(32).toString("hex"),
            }).save();

            const url = `${process.env.FrontEnd_Url}company/${exist._id}/varification/${emailToken.token}`;
            console.log(url);
            sendMail(email, "Company Varification mail", url);
            return res.status(200).json({
              created: true,
              message:
                "Your account is not verified; an email has been sent to your account. Please click the link to verify.",
            });
          }
        } else {
          return res.json({
            loginSuccess: false,
            message: "The password you entered is incorrect.",
          });
        }
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

//------------------------------------- Forget password ----------------------------------------//

export const companyforgetPassword = async (req, res) => {
  try {
    const exist = await companyDb.findOne({ email: req.body.email });

    if (!exist) {
      return res.json({ message: "The entered email addresses do not match." });
    } else {
      if (!exist.is_varified) {
        return res.json({ message: "Your account has yet to be verified." });
      } else {
        const emailToken = await new authTokenDb({
          companyId: exist._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.FrontEnd_Url}company/${exist._id}/resetPassword/${emailToken.token}`;
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

//------------------------------------------- Forget password ----------------------------------------//

export const companyResetPassword = async (req, res) => {
  try {
    const { password } = req.body.values;
    const hashedPassword = await passwordHasher(password);
    const validLink = await authTokenDb.findOne({
      companyId: req.body.companyId,
    });

    if (validLink && validLink.token == req.body.token) {
      await authTokenDb.deleteOne({ companyId: req.body.companyId });
      const updated = await companyDb.findByIdAndUpdate(
        { _id: req.body.companyId },
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
        return res.json({
          reseted: false,
          message: "An error occurred during the reset process.",
        });
      }
    } else {
      return res.json({ message: "The link you clicked is not valid." });
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------ Google registration ----------------------------------------//

export const googleRegister = async (req, res) => {
  try {
    const { email, id, name, number } = req.body;
    const exist = await companyDb.findOne({ email: email });
    if (exist) {
      return res.json({
        message: "The email you provided is already registered.",
      });
    } else {
      const hashedpass = await passwordHasher(id);
      const googleUser = new companyDb({
        companyName: name,
        email,
        number: number || "000000000000",
        password: hashedpass,
        is_google: true,
        is_varified: true,
      });
      const userData = await googleUser
        .save()
        .then(console.log("user registered"));

      if (userData) {
        const jwtToken = tokenJwt(userData);
        return res.status(200).json({
          created: true,
          message: "Google registration successfull",
          jwtToken,
          userData,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
