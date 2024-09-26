


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Api } from '../utils/api';

interface ResponseData {
  [key: string]: any; // Adjust based on your response structure
}

interface FormResponsesDisplayProps {
  formId: string;
}

const FormResponsesDisplay: React.FC<FormResponsesDisplayProps> = ({ formId }) => {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(`${Api}/user/get_responses`, {
          params: { formId }
        });
        setResponses(res.data.responses); // Adjust based on your API response structure
      } catch (err) {
        setError('Error fetching responses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Form Responses</h2>
      <ul>
        {responses.map((response, index) => (
          <li key={index} className="mb-4">
            <div className="p-4 border rounded shadow">
              {Object.entries(response).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <strong>{key}:</strong> {typeof value === 'string' && value.includes('http') ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a> : value.toString()}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormResponsesDisplay;
