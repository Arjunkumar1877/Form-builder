import mongoose from "mongoose";

const userResponseSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Form",
    },
    responses: [
      {
        fieldName: {
          type: String,
        },
        response: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export const UserResponseModel = mongoose.model(
  "UserResponse",
  userResponseSchema
);
