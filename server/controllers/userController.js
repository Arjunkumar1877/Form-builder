import { FormModel } from "../models/formModel.js";
import { UserModel } from "../models/userModel.js";
import bcrypt from 'bcryptjs';

class UserController {

  signupUser = async (req, res) => {
    try {
      let user = await UserModel.findOne({email: req.body.email})

      if (!user) {
        const newUserCreate = await UserModel.create(req.body);

        if (newUserCreate) {
          const savedData = {
            _id: newUserCreate._id,
            email: newUserCreate.email,
            name: newUserCreate.name,
          };

          if (newUserCreate) {
            res.status(200).json({
              message: "User data successfully",
              data: savedData,
              success: false,
            });
          }
        }
      } else {
        res.status(200).json({
          message: "User already exist",
          data: null,
          success: false,
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Internal server error", data: null, success: false });
    }
  };

  loginUser = async (req, res) => {
    try {
        console.log(req.body)
        let user = await UserModel.findOne({email: req.body.userData.email})

      if (user) {
     
          if (user.email === req.body.userData.email) {
            const checkPassword = await bcrypt.compare(
                req.body.userData.password,
                user?.password
              );
            if (checkPassword) {
              const userData = {
                _id: user._id,
                email: user.email,
                name: user.name,
              };

              res.json({
                message: "Successfully logged in",
                success: true,
                data: userData,
              });
            } else {
              res
                .status(400)
                .json({
                  message: "Invalid credentials.",
                  success: false,
                  data: null,
                });
            }
          } else {
            res
              .status(400)
              .json({
                message: "Invalid credentials",
                success: false,
                data: null,
              });
          }

      } else {
        res
          .status(400)
          .json({ message: "User doesn't exist", success: false, data: null });
      }
    } catch (error) {
      res.status(500).json({ message: error, success: false, data: null });
    }
  };







  saveForm = async (req, res) => {
    try {
      const { creatorId, title, fields } = req.body;

      if (!creatorId || !title || !fields || fields.length === 0) {
        return res.status(400).json({
          message: "Creator ID, title, and fields are required.",
          success: false,
        });
      }

      const newForm = new FormModel({
        creatorId,
        title,
        fields,
      });

      const savedForm = await newForm.save();

      return res.status(201).json({
        message: "Form saved successfully",
        data: savedForm,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
    }
  };
}

export const userController = new UserController();
