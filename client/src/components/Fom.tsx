

import React from 'react';

// Define the possible field types
type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'upload' | 'datetime';

// Interface for Field object
interface Field {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
}

// Props interface for FormDisplay
interface FormDisplayProps {
  title: string;
  fields: Field[];
}

// FormDisplay component
const FormDisplay: React.FC<FormDisplayProps> = ({ title, fields }) => {
  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>

      {fields.map((field) => (
        <div key={field.id} className="mb-4">
          <label className="block text-lg font-semibold mb-2">{field.label}</label>
          {field.type === 'text' && <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter text" />}
          {field.type === 'number' && <input type="number" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter number" />}
          {field.type === 'dropdown' && (
            <select className="w-full p-2 border border-gray-300 rounded">
              <option value="">Select an option</option>
              {field.options?.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          )}
          {field.type === 'checkbox' &&
            field.options?.map((option, index) => (
              <label key={index} className="block">
                <input type="checkbox" className="mr-2" /> {option}
              </label>
            ))}
          {field.type === 'radio' &&
            field.options?.map((option, index) => (
              <label key={index} className="block">
                <input type="radio" name={field.id} className="mr-2" /> {option}
              </label>
            ))}
          {field.type === 'upload' && <input type="file" className="w-full p-2 border border-gray-300 rounded" />}
          {field.type === 'datetime' && (
            <div className="flex space-x-2">
              <input type="date" className="w-full p-2 border border-gray-300 rounded" />
              <input type="time" className="w-full p-2 border border-gray-300 rounded" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormDisplay;
