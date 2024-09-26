import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Api } from "../utils/api";
import FormDisplay from "../components/FomDisplay";
import Header from "../components/Header";

type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'upload' | 'datetime' | 'email';

interface Field {
  _id?: string;
  label: string;
  type: FieldType; 
  options?: string[];
  required: boolean;
}

interface FormData {
  _id?: string;
  title: string;
  fields: Field[];
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

const Form = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const formId = query.get('formId') || "66f56a5ca73d0a037bcacce5"; 
  const creatorId = query.get('creatorId');

  console.log(formId, "  ", creatorId)

  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${Api}/user/getA_form/${formId}/${creatorId}`);
        const { title, fields } = res.data;
        setFormData({ ...res.data, title, fields });
        setError(null); 
      } catch (error: any) {
        console.error(error);
        setError(error.response?.data?.message || 'Failed to load the form. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [creatorId, formId]);

  console.log(formData);

  return (
    <div>
      <Header />
      {loading && <p>Loading form...</p>}
      {error && <p className="text-red-500">{error}</p>} 
      {!loading && !error && formData && (
        <FormDisplay 
          title={formData.title} 
          formId={formId}
          fields={formData.fields.map(field => ({
            id: field._id || 'default-id',
            label: field.label,
            type: field.type,
            options: field.options ?? [], // Optional chaining for default options
            required: field.required
          }))} 
        />
      )}
    </div>
  );
};

export default Form;


