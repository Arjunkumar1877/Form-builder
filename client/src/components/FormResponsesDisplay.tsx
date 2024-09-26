import { useEffect, useState } from 'react';
import axios from 'axios';
import { Api } from '../utils/api';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast

interface ResponseData {
  _id: string;
  createdAt: string;
  formId: string;
  responses: { key: string; value: string; _id: string }[];
}

const FormResponsesDisplay = () => {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const formId = query.get('formId'); // Use query param if available

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(`${Api}/user/get_responses/${formId}`);
        setResponses(res.data.data);
      } catch (err) {
        setError('Error fetching responses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!'); // Show success toast
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy link!'); // Show error toast if copy fails
    });
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <>
      <Header />
      <br />
      <div className="p-6 max-w-6xl mx-auto bg-slate-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Form Responses</h2>

        {responses.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-500 mb-2">No responses available for this form yet.</p>
            <p className="text-sm text-gray-400">Once users start submitting responses, they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {responses.map((response) => (
              <div key={response._id} className="p-4 border rounded-lg shadow bg-gray-50 transition duration-200 hover:shadow-lg">
                <h3 className="font-semibold mb-2">Response ID: {response._id}</h3>
                <p className="mb-2 text-gray-600">Created At: {new Date(response.createdAt).toLocaleString()}</p>
                {response.responses.map(({ key, value, _id }) => (
                  <div key={_id} className="mb-2 flex items-center">
                    <strong className="mr-2">{key}:</strong>
                    {typeof value === 'string' && (value.startsWith('https://') || value.startsWith('http')) ? (
                      // Skip displaying the value if it's an image URL
                      <div className="flex items-center mt-1">
                        <img src={value} alt={key} className="w-12 h-12 rounded-md object-cover mr-2" />
                        <button
                          onClick={() => handleCopyLink(value)}
                          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-200"
                        >
                          Copy Link
                        </button>
                      </div>
                    ) : (
                      // Display all other values
                      <span className="text-gray-800">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover /> {/* Add ToastContainer */}
    </>
  );
};

export default FormResponsesDisplay;
