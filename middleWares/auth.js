import jwt from "jsonwebtoken";
import userDb from "../models/userModel.js";
import companyDb from "../models/companyModel.js";

import dotenv from "dotenv";
dotenv.config();

//--------------------------------------User auth----------------------------------------//

export const userAuth = async (req, res, next) => {
  try {


    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.jwtSecretKey);
      const exist = await userDb.findOne({_id:decode.exist._id})
      if (exist) {
        if (exist.is_blocked === false) {
          req.headers.userId = exist._id;
          next();
        } else {
          res.json({ message: "user where blocked by admin" });
        }
      } else {
        res.json({ message: "user not authorised or inavid user" });
      }
    } else {
      res.json({ message: "user not authorized" });
    }

  } catch (error) {}
};

//--------------------------------------Company auth------------------------------------//

export const companyAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const urlEncodedToken = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(urlEncodedToken, process.env.jwtSecretKey);
      const exist = await companyDb.findOne({ _id:decode.exist._id});
      if (exist) {
        if (exist.is_blocked === false) {
          req.headers.companyId = exist._id;
          next();
        } else {
          res.json({ message: "user where blocked by admin" });
        }
      } else {
        res.json({ message: "user not authorised or inavid user" });
      }
    } else {
      res.json({ message: "user not authorized" });
    }
  } catch (error) {}
};
