import React, { useState } from 'react';

type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'upload' | 'datetime';

interface Field {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
}

const FormBuilder: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [newField, setNewField] = useState<Partial<Field>>({ type: 'text', label: '' }); 

  const handleAddField = () => {
    if (newField.label && newField.type) {
      const id = `field-${fields.length + 1}`;
      const field: Field = {
        id,
        label: newField.label,
        type: newField.type,
        options: newField.type === 'dropdown' || newField.type === 'checkbox' || newField.type === 'radio' ? newField.options || [] : undefined,
      };

      setFields([...fields, field]); 
      setNewField({ type: 'text', label: '' }); 
    } else {
      alert('Please provide a label and select a type.');
    }
  };

  
  const handleSubmit = () => {
    if (!formTitle.trim()) {
      alert('Form title is required');
      return;
    }
    console.log({ title: formTitle, fields });
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Custom Form Builder</h2>

      <input
        type="text"
        placeholder="Enter Form Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mb-6">
        <label className="block text-xl font-semibold mb-2 text-gray-700">New Field</label>
        <input
          type="text"
          placeholder="Field Label (e.g., Name, Email)"
          value={newField.label || ''}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={newField.type}
          onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="dropdown">Dropdown</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio</option>
          <option value="upload">Upload</option>
          <option value="datetime">Date/Time</option>
        </select>

        {(newField.type === 'dropdown' || newField.type === 'checkbox' || newField.type === 'radio') && (
          <input
            type="text"
            placeholder="Enter options (comma-separated)"
            value={newField.options?.join(', ') || ''}
            onChange={(e) =>
              setNewField({
                ...newField,
                options: e.target.value.split(',').map((option) => option.trim()),
              })
            }
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <button
          onClick={handleAddField}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Field
        </button>
      </div>

      {fields.map((field) => (
        <div key={field.id} className="mb-6 relative p-4 bg-gray-50 rounded-lg border border-gray-300">
          <label className="block text-lg font-semibold mb-2">{field.label}</label>
          <button
            onClick={() => handleDeleteField(field.id)}
            className="absolute right-4 top-4 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
          {field.type === 'text' && (
            <input
              type="text"
              placeholder={`Enter ${field.label}`}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {field.type === 'number' && (
            <input
              type="number"
              placeholder={`Enter ${field.label}`}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {field.type === 'dropdown' && (
            <select className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {field.options?.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          )}
          {field.type === 'checkbox' &&
            field.options?.map((option, index) => (
              <label key={index} className="block text-lg">
                <input type="checkbox" className="mr-2" /> {option}
              </label>
            ))}
          {field.type === 'radio' &&
            field.options?.map((option, index) => (
              <label key={index} className="block text-lg">
                <input type="radio" name={field.id} className="mr-2" /> {option}
              </label>
            ))}
          {field.type === 'upload' && (
            <input
              type="file"
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {field.type === 'datetime' && (
            <div className="flex space-x-4">
              <input
                type="date"
                className="w-1/2 p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                className="w-1/2 p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Submit Form
      </button>
    </div>
  );
};

export default FormBuilder;
