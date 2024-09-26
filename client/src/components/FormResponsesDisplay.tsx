import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { app } from "../firebase/firebase";
import axios from "axios";
import { Api } from "../utils/api";
import { useNavigate } from "react-router-dom";

type FieldType =
  | "text"
  | "number"
  | "dropdown"
  | "checkbox"
  | "radio"
  | "upload"
  | "datetime"
  | "email";

interface Field {
  id: string;
  label: string;
  type: FieldType;
  options?: string[]; // For dropdown, checkbox, and radio fields
  required?: boolean;
}

interface FormDisplayProps {
  title: string;
  formId: string;
  fields: Field[];
}

const FormDisplay: React.FC<FormDisplayProps> = ({ title, fields, formId }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
    null
  );
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (id: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleUploadFile = async (): Promise<string | null> => {
    if (!file) {
      setImageUploadError("Please select an image or PDF");
      return null;
    }

    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Math.round(progress));
        },
        (error) => {
          setImageUploadError("File upload failed");
          setImageUploadProgress(null);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            resolve(downloadURL);
            setFile(null); // Reset file state after successful upload
          });
        }
      );
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const fieldValue = formValues[field.id];
      if (field.required && !fieldValue) {
        newErrors[field.id] = `${field.label} is required`;
      } else {
        switch (field.type) {
          case "email":
            if (fieldValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
              newErrors[field.id] = `Invalid email format for ${field.label}`;
            }
            break;
          case "number":
            if (fieldValue !== undefined && isNaN(Number(fieldValue))) {
              newErrors[field.id] = `${field.label} must be a valid number`;
            }
            break;
          case "upload":
            if (
              file &&
              !["image/jpeg", "image/png", "application/pdf"].includes(
                file.type
              )
            ) {
              newErrors[
                field.id
              ] = `Only JPEG, PNG images, and PDF files are allowed for ${field.label}`;
            }
            break;
          case "datetime":
            if (
              fieldValue &&
              new Date(fieldValue).toString() === "Invalid Date"
            ) {
              newErrors[
                field.id
              ] = `${field.label} must be a valid date and time`;
            }
            break;
          default:
            break;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      try {
        let uploadedFileUrl: string | null = null;
        if (file) {
          uploadedFileUrl = await handleUploadFile();
        }

        // Transform formValues into an array of objects
        const finalData = fields.map((field) => ({
          key: field.label,
          value:
            field.type === "upload" ? uploadedFileUrl : formValues[field.id],
        }));

        console.log("Form submitted successfully:", finalData);

        const res = await axios.post(`${Api}/user/add_response`, {
          formId,
          responses: finalData,
        });

        console.log(res.data);
        toast.success("Form submitted successfully!"); // Notify user of success
        navigate("/success", {
          state: { responses: finalData },
          replace: true,
        });
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("Error submitting form. Please try again later."); // Notify user of error
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
        {title}
      </h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.id} className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-700">
              {field.label}
            </label>
            {field.type === "text" && (
              <input
                type="text"
                className={`w-full p-3 border ${
                  errors[field.id]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg transition duration-150 focus:outline-none focus:ring-2`}
                placeholder={`Enter ${field.label}`}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === "number" && (
              <input
                type="number"
                className={`w-full p-3 border ${
                  errors[field.id]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg transition duration-150 focus:outline-none focus:ring-2`}
                placeholder={`Enter ${field.label}`}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === "email" && (
              <input
                type="email"
                className={`w-full p-3 border ${
                  errors[field.id]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg transition duration-150 focus:outline-none focus:ring-2`}
                placeholder={`Enter ${field.label}`}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === "datetime" && (
              <input
                type="datetime-local"
                className={`w-full p-3 border ${
                  errors[field.id]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg transition duration-150 focus:outline-none focus:ring-2`}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === "dropdown" && (
              <select
                className={`w-full p-3 border ${
                  errors[field.id]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg transition duration-150 focus:outline-none focus:ring-2`}
                onChange={(e) => handleChange(field.id, e.target.value)}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {field.type === "checkbox" && field.options && (
              <div>
                {field.options.map((option) => (
                  <label key={option} className="inline-flex items-center mb-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      value={option}
                      onChange={(e) => {
                        const currentValues = formValues[field.id]
                          ? formValues[field.id].split(", ")
                          : [];
                        if (e.target.checked) {
                          currentValues.push(option);
                        } else {
                          const index = currentValues.indexOf(option);
                          currentValues.splice(index, 1);
                        }
                        handleChange(field.id, currentValues.join(", "));
                      }}
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                ))}
              </div>
            )}
            {field.type === "radio" && field.options && (
              <div>
                {field.options.map((option) => (
                  <label
                    key={option}
                    className="inline-flex items-center mr-4"
                  >
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      name={field.id}
                      value={option}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                ))}
              </div>
            )}
            {field.type === "upload" && (
              <div className="flex flex-col space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  className="text-gray-700"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
                {imageUploadProgress !== null && (
                  <progress
                    value={imageUploadProgress}
                    max="100"
                    className="w-full"
                  >
                    {imageUploadProgress}%
                  </progress>
                )}
                {imageUploadError && (
                  <p className="text-red-500 text-sm">{imageUploadError}</p>
                )}
              </div>
            )}
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-150 font-semibold"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormDisplay;

