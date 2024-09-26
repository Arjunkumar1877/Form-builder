import FormDisplay from "../components/Fom"
type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'upload' | 'datetime' | 'email';

interface Field {
  id: string;
  label: string;
  type: FieldType; 
  options?: string[];
}

const staticFields: Field[] = [
  { id: 'field-1', label: 'WEmail', type: 'email' },
  { id: 'field-2', label: 'Age', type: 'number' },
  { id: 'field-3', label: 'Gender', type: 'radio', options: ['Male', 'Female', 'Other'] },
  { id: 'field-4', label: 'Favorite Colors', type: 'checkbox', options: ['Red', 'Green', 'Blue'] },
  { id: 'field-5', label: 'Country', type: 'dropdown', options: ['USA', 'Canada', 'UK'] },
  { id: 'field-6', label: 'Upload File', type: 'upload' },
  { id: 'field-7', label: 'Appointment Date', type: 'datetime' },
];

const Form = () => {
  const formTitle = "Sample Form";


  return (
    <div>
      <FormDisplay title={formTitle} fields={staticFields} />
    </div>
  )
}

export default Form