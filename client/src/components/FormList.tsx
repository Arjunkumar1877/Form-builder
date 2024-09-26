import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Api } from '../utils/api';

interface Field {
  id: string;
  label: string;
  type: string;
  options?: string[];
  required?: boolean;
}

interface Form {
  title: string;
  fields: Field[];
}

const FormList = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const { currentUser } = useSelector((state: any) => state.user);

  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const res = await axios.get(`${Api}/user/get_forms/${currentUser._id}`);
        if (res.data.success) {
          setForms(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllForms();
  }, [currentUser._id]);

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Forms</h2>

      {forms.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No forms added yet.</p>
      ) : (
        forms.map((form, index) => (
          <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-semibold mb-4">{form.title}</h3>
            <ul className="mb-4">
              {form.fields.map((field) => (
                <li key={field.id} className="mb-2 text-gray-700">
                  <strong>{field.label}</strong>: {field.type}
                  {field.options && field.options.length > 0 && (
                    <span className="ml-2 text-sm text-gray-600">
                      (Options: {field.options.join(', ')})
                    </span>
                  )}
                  {field.required && <span className="text-red-500"> *Required</span>}
                </li>
              ))}
            </ul>
            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300">
                View
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FormList;
