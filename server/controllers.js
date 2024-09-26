import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { SendEmailOtp } from "../services/nodemailer";
import { otp } from "../services/otpGenerate";
import bcrypt from "bcryptjs";
import { jwtSign } from "../services/jwtServices";

class UserController {
  async findUser(key, value) {
    return await UserModel.findOne({ [key]: value });
  }

  signupUser = async (req, res) => {
    try {
      let user = await this.findUser(req.params.key, req.body.email);


      const newUserCreate = await UserModel.create(req.body);

      if (newUserCreate) {
        const savedData = {
          _id: newUserCreate._id,
          email: newUserCreate.email,
          name: newUserCreate.name
        };

        if (newUserCreate){
          res.status(200).json({
            message: "User data successfully",
            data: savedData,
            success: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error", data: null, success: false });
    }
  };


  // Function to login a user
  loginUser = async (req, res) => {
    try {
      let user = await this.findUser(req.params.key, req.body.email);

      if (user) {
        if (user.verified) {
          if (user.email === req.body.email) {
 
            if (user.password === req.body.password) {
              const userData = {
                _id: user._id,
                email: user.email,
               name: user.name
              };
        
              res
                .json({
                  message: "Successfully logged in",
                  success: true,
                  data: userData,
                });
            } else {
              res.status(400).json({ message: "Invalid credentials.", success: false, data: null });
            }
          } else {
            res.status(400).json({ message: "Invalid credentials", success: false, data: null });
          }
        } else {
          res.status(400).json({ message: "User doesn't exist", success: false, data: null });
        }
      } else {
        res.status(400).json({ message: "User doesn't exist", success: false, data: null });
      }
    } catch (error) {
      res.status(500).json({ message: error, success: false, data: null });
    }
  };


}

export const userController = new UserController();
