// src/components/Success.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Success: React.FC = () => {
  const location = useLocation();
  const responses = location.state?.responses || []; // Get the responses from the location state

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="p-6 max-w-lg mt-14 mx-auto bg-slate-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Success!</h2>
      <p className="text-center">Your responses have been saved successfully.</p>
      <h3 className="text-lg font-semibold mt-4">Your Responses:</h3>
      <ul className="list-disc list-inside">
        {responses.map((response: any, index: number) => (
          <li key={index} className="flex items-center justify-between mb-2">
            {response.value.startsWith("https://") ? (
              <>
                <span>{response.key}:</span>
                <div className="flex items-center space-x-2">
                  <img src={response.value} alt={response.key} className="w-16 h-16 object-cover rounded" />
                  <button
                    onClick={() => copyToClipboard(response.value)}
                    className="text-blue-600 hover:underline"
                  >
                    Copy Link
                  </button>
                </div>
              </>
            ) : (
              `${response.key}: ${response.value}`
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Success;
