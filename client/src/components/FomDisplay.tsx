import React, { useState } from 'react';

// Define the possible field types
type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'upload' | 'datetime' | 'email';

// Interface for Field object
interface Field {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean; // Add required field
}

interface FormDisplayProps {
  title: string;
  fields: Field[];
}

const FormDisplay: React.FC<FormDisplayProps> = ({ title, fields }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' })); 
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
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
              newErrors[field.id] = `Invalid email format for ${field.label}`;
            }
            break;
          case 'number':
            if (fieldValue !== undefined && fieldValue !== null && isNaN(fieldValue)) {
              newErrors[field.id] = `${field.label} must be a valid number`;
            }
            break;
          case 'upload':
            if (fieldValue && !['image/jpeg', 'image/png'].includes(fieldValue.type)) {
              newErrors[field.id] = `Only JPEG and PNG files are allowed for ${field.label}`;
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
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      console.log('Form submitted successfully:', formValues);
      // Proceed with form submission logic (e.g., API call)
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
            {field.type === 'dropdown' && (
              <select
                className={`w-full p-2 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded transition duration-150`}
                onChange={(e) => handleChange(field.id, e.target.value)}
              >
                <option value="">Select an option</option>
                {field.options?.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            )}
            {field.type === 'checkbox' && field.options?.map((option, index) => (
              <label key={index} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formValues[field.id]?.includes(option) || false}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...(formValues[field.id] || []), option]
                      : formValues[field.id]?.filter((item: string) => item !== option);
                    handleChange(field.id, newValues);
                  }}
                /> {option}
              </label>
            ))}
            {field.type === 'radio' && field.options?.map((option, index) => (
              <label key={index} className="block">
                <input
                  type="radio"
                  name={field.id}
                  className="mr-2"
                  checked={formValues[field.id] === option}
                  onChange={() => handleChange(field.id, option)}
                /> {option}
              </label>
            ))}
            {field.type === 'upload' && (
              <input
                type="file"
                accept="image/jpeg, image/png"
                className={`w-full p-2 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded transition duration-150`}
                onChange={(e) => handleChange(field.id, e.target.files ? e.target.files[0] : null)}
              />
            )}
            {field.type === 'datetime' && (
              <div className="flex space-x-2">
                <input
                  type="date"
                  className={`w-full p-2 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded transition duration-150`}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
                <input
                  type="time"
                  className={`w-full p-2 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded transition duration-150`}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              </div>
            )}
            {errors[field.id] && <p className="text-red-500 text-sm">{errors[field.id]}</p>} {/* Display error message */}
          </div>
        ))}
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150">Submit</button>
      </form>
    </div>
  );
};

export default FormDisplay;
