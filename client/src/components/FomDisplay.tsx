import React, { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { app } from '../firebase/firebase';
import axios from 'axios';
import { Api } from '../utils/api';

type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'upload' | 'datetime' | 'email';

interface Field {
  id: string;
  label: string;
  type: FieldType;
  options?: string[]; // For dropdown and radio fields
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
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const handleChange = (id: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleUploadFile = async () => {
    if (!file) {
      setImageUploadError('Please select an image or PDF');
      return null;
    }

    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Math.round(progress));
        },
        (error) => {
          setImageUploadError('File upload failed');
          setImageUploadProgress(null);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            resolve(downloadURL);
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
          case 'email':
            if (fieldValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
              newErrors[field.id] = `Invalid email format for ${field.label}`;
            }
            break;
          case 'number':
            if (fieldValue !== undefined && isNaN(Number(fieldValue))) {
              newErrors[field.id] = `${field.label} must be a valid number`;
            }
            break;
          case 'upload':
            if (file && !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
              newErrors[field.id] = `Only JPEG, PNG images, and PDF files are allowed for ${field.label}`;
            }
            break;
          case 'datetime':
            if (fieldValue && new Date(fieldValue).toString() === 'Invalid Date') {
              newErrors[field.id] = `${field.label} must be a valid date and time`;
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
        let uploadedFileUrl = null;
        if (file) {
          uploadedFileUrl = await handleUploadFile();
        }

        const finalData = {
          ...formValues,
          file: uploadedFileUrl,
        };

        console.log('Form submitted successfully:', finalData);

        const res = await axios.post(`${Api}/user/add_response`, {
          formId,
          responses: finalData,
        });

        console.log(res.data);
        // Add further form submission logic here
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{title}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.id} className="mb-4">
            <label className="block text-lg font-semibold mb-2 text-gray-700">{field.label}</label>
            {field.type === 'text' && (
              <input
                type="text"
                className={`w-full p-2 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded transition duration-150`}
                placeholder={`Enter ${field.label}`}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === 'number' && (
              <input
                type="number"
                className={`w-full p-2 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded transition duration-150`}
                placeholder={`Enter ${field.label}`}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === 'email' && (
              <input
                type="email"
                className={`w-full p-2 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded transition duration-150`}
                placeholder={`Enter ${field.label}`}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === 'datetime' && (
              <input
                type="datetime-local"
                className={`w-full p-2 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded transition duration-150`}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === 'dropdown' && (
              <select
                className={`w-full p-2 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded transition duration-150`}
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
            {field.type === 'checkbox' && (
              <input
                type="checkbox"
                className="mr-2"
                onChange={(e) => handleChange(field.id, e.target.checked)}
              />
            )}
            {field.type === 'radio' && (
              <div>
                {field.options?.map((option) => (
                  <label key={option} className="mr-4">
                    <input
                      type="radio"
                      name={field.id}
                      value={option}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {field.type === 'upload' && (
              <input
                type="file"
                accept="image/jpeg, image/png, application/pdf"
                className="w-full p-2 border border-gray-300 rounded transition duration-150"
                onChange={(e) => {
                  const selectedFile = e.target.files ? e.target.files[0] : null;
                  if (
                    selectedFile &&
                    !['image/jpeg', 'image/png', 'application/pdf'].includes(selectedFile.type)
                  ) {
                    toast.error('Invalid file type. Only JPEG, PNG, and PDF are allowed.');
                    setFile(null);
                  } else {
                    setFile(selectedFile);
                    handleChange(field.id, selectedFile);
                  }
                }}
              />
            )}
            {errors[field.id] && <span className="text-red-500">{errors[field.id]}</span>}
          </div>
        ))}
        {imageUploadProgress !== null && <div>Uploading file: {imageUploadProgress}%</div>}
        {imageUploadError && <div className="text-red-500">{imageUploadError}</div>}
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-150"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormDisplay;
