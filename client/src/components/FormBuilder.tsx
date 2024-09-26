import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Api } from '../utils/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'upload' | 'datetime' | 'email';

interface Field {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
}

const FormBuilder: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [formTitle, setFormTitle] = useState<string>('Untitled Form');
  const [newField, setNewField] = useState<Partial<Field>>({ type: 'text', label: '', options: ['Untitled'] });
  const [editFieldId, setEditFieldId] = useState<string | null>(null);
  const { currentUser } = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  const handleAddField = () => {
    if (newField.label && newField.type) {
      const id = `field-${fields.length + 1}`;
      const existingField = fields.find(field => field.label === newField.label);

      if (existingField) {
        toast.error('Field with this label already exists.');
        return;
      }

      if (editFieldId) {
        const updatedFields = fields.map((field) =>
          field.id === editFieldId ? { ...field, label: newField.label!, type: newField.type!, options: newField.options || [] } : field
        );
        setFields(updatedFields);
        setEditFieldId(null);
        toast.success('Field updated successfully!');
      } else {
        const field: Field = {
          id,
          label: newField.label!,
          type: newField.type!,
          options: newField.options || [],
          required: true,
        };
        setFields([...fields, field]);
        toast.success('Field added successfully!');
      }

      setNewField({ type: 'text', label: '', options: ['Untitled'] });
    } else {
      toast.error('Please provide a label and select a type.');
    }
  };

  const handleEditField = (fieldId: string) => {
    const fieldToEdit = fields.find((field) => field.id === fieldId);
    if (fieldToEdit) {
      setNewField({
        label: fieldToEdit.label,
        type: fieldToEdit.type,
        options: fieldToEdit.options || ['Untitled'],
      });
      setEditFieldId(fieldId);
    }
  };

  const handleSubmit = async () => {
    if (!formTitle.trim()) {
      toast.error('Form title is required');
      return;
    }

    console.log({ title: formTitle, fields });

    const res = await axios.post(`${Api}/user/add_form`, {
      creatorId: currentUser._id,
      title: formTitle,
      fields
    });

    console.log(res.data);
    toast.success('Form submitted successfully!');
    navigate("/form_list")
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    toast.success('Field deleted successfully!');
  };

  const handleAddOption = () => {
    setNewField({
      ...newField,
      options: [...(newField.options || []), 'Untitled'],
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...(newField.options || [])];
    updatedOptions[index] = value;
    setNewField({
      ...newField,
      options: updatedOptions,
    });
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...(newField.options || [])];
    updatedOptions.splice(index, 1);
    setNewField({
      ...newField,
      options: updatedOptions,
    });
  };

  return (
<>
<Header />
<br />
<div className="p-8 max-w-3xl w-full mx-auto bg-slate-100 rounded-xl shadow-lg mt-10">
      
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Form Builder</h1>
      <label htmlFor="form-title" className="block text-md font-semibold mb-2 text-gray-500">Form Title</label>
      <input
        type="text"
        placeholder="Enter Form Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mb-6">
        <label className="block text-md font-semibold mb-2 text-gray-500">Field Name</label>
        <div className='flex'>
          <input
            type="text"
            placeholder="Field Label (e.g., Name, Email)"
            value={newField.label || ''}
            onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            className="w-8/12 p-3 mb-4 mr-3 border border-gray-300 rounded-lg text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newField.type}
            onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
            className="w-4/12 p-3 mb-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="dropdown">Dropdown</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="upload">Upload</option>
            <option value="datetime">Date/Time</option>
            <option value="email">Email</option>
          </select>
        </div>

        {(newField.type === 'dropdown' || newField.type === 'checkbox' || newField.type === 'radio') && (
          <>
            <label className="block text-md font-semibold mb-2 text-gray-500">Options</label>
            {newField.options?.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-10/12 p-2 border border-gray-300 rounded-lg text-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                />
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 focus:outline-none"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddOption}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Option
            </button>
          </>
        )}

<div className='w-full flex justify-end'>

<button
  onClick={handleAddField}
  className="w-1/6  px-6 py-3 mt-4 bg-black text-white text-sm font-semibold rounded-3xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  {editFieldId ? 'Update Field' : 'Add Field'}
</button>
</div>
      </div>

      {fields.map((field) => (
        <div key={field.id} className="mb-6 relative p-4 bg-gray-50 rounded-lg border border-gray-300">
          <label className="block text-lg font-semibold mb-2">{field.label} {field.required && <span className="text-red-500">*</span>}</label>
   
          <button
            onClick={() => handleEditField(field.id)}
            className="absolute right-4 top-4  text-black font-semibold px-2 py-1 rounded-lg hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteField(field.id)}
            className="absolute right-20 top-4 font-semibold text-red-500 px-2 py-1 rounded-lg hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>

          {field.type === 'text' && (
            <input
              type="text"
              placeholder={`Enter ${field.label}`}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={field.required}
            />
          )}
          {field.type === 'number' && (
            <input
              type="number"
              placeholder={`Enter ${field.label}`}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={field.required}
            />
          )}
          {field.type === 'email' && (
            <input
              type="email"
              placeholder={`Enter ${field.label}`}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={field.required}
            />
          )}
          {field.type === 'dropdown' && (
            <select className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required={field.required}>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          )}
          {field.type === 'checkbox' && (
            <input type="checkbox" className="mr-2" required={field.required} />
          )}
          {field.type === 'radio' && (
            field.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input type="radio" value={option} className="mr-2" required={field.required} />
                <label>{option}</label>
              </div>
            ))
          )}
          {field.type === 'upload' && (
            <input type="file" className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required={field.required} />
          )}
          {field.type === 'datetime' && (
            <input type="datetime-local" className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required={field.required} />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full px-6 py-3 mt-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Submit Form
      </button>
    </div>
</>
  );
};

export default FormBuilder;
