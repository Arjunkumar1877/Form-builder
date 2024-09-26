import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Api } from '../utils/api';
import { toast } from 'react-toastify'; // Import toast
import Swal from 'sweetalert2'; // Import SweetAlert

interface Field {
  id: string;
  label: string;
  type: string;
  options?: string[];
  required?: boolean;
}

interface Form {
  _id: string;
  title: string;
  fields: Field[];
}

interface User {
  _id: string;
}

interface RootState {
  user: {
    currentUser: User;
  };
}

const FormList = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const protocol = window.location.protocol;
  const host = window.location.host;

  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const res = await axios.get(`${Api}/user/get_forms/${currentUser._id}`);
        if (res.data.success) {
          setForms(res.data.data as Form[]);
        } else {
          setError('Failed to fetch forms');
          toast.error('Failed to fetch forms'); // Show error toast
        }
      } catch (error) {
        console.error('Error fetching forms:', error);
        setError('An error occurred while fetching forms. Please try again later.');
        toast.error('An error occurred while fetching forms. Please try again later.'); // Show error toast
      }
    };

    fetchAllForms();
  }, [currentUser._id]);

  const handleAddNewForm = () => {
    navigate('/add_form');
  };

  const handleDelete = async (formId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the form!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${Api}/user/delete_form/${formId}`);
        if (res.data.success) {
          setForms(forms.filter(form => form._id !== formId));
          toast.success('Form deleted successfully.'); // Show success toast
        } else {
          toast.error('Failed to delete form. Please try again.'); // Show error toast
        }
      } catch (error) {
        console.error('Error deleting form:', error);
        toast.error('An error occurred while deleting the form. Please try again later.'); // Show error toast
      }
    }
  };

  const copyLinkToClipboard = (formId: string) => {
    const link = `${protocol}//${host}/form?formId=${formId}&creatorId=${currentUser._id}`;

    navigator.clipboard.writeText(link)
      .then(() => {
        toast.success('Link copied to clipboard!'); // Show success toast
      })
      .catch(() => {
        toast.error('Failed to copy the link.'); // Show error toast
      });
  };

  const renderAddNewFormButton = () => (
    <button
      onClick={handleAddNewForm}
      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300"
    >
      Add New Form
    </button>
  );

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Forms</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {forms.length === 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-center text-lg text-gray-500 mb-6">No forms added yet.</p>
          {renderAddNewFormButton()}
        </div>
      ) : (
        <div>
          <div className="flex justify-start mb-6">
            {renderAddNewFormButton()}
          </div>

          {forms.map((form) => (
            <div
              key={form._id}
              className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">{form.title.toUpperCase()}</h3>
              <ul className="mb-4 list-disc list-inside">
                {form.fields.map((field) => (
                  <li key={field.id} className="mb-2 text-gray-700">
                    <strong>{field.label.toUpperCase()}</strong>: {field.type}
                    {field.options && field.options.length > 0 && (
                      <span className="ml-2 text-sm text-gray-800">
                        (Options: {field.options.join(', ')})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end space-x-4">
                <Link
                  to={`/response?formId=${form._id}`}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
                >
                  View Responses
                </Link>
                <button
                  onClick={() => handleDelete(form._id)}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300"
                >
                  Delete
                </button>
                <button
                  onClick={() => copyLinkToClipboard(form._id)}
                  className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormList;
