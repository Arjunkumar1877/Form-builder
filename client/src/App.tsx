import './App.css';
import FormDisplay from './components/Fom';
import FormBuilder from './components/FormBuilder';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'upload' | 'datetime';

interface Field {
  id: string;
  label: string;
  type: FieldType; 
  options?: string[];
}

const staticFields: Field[] = [
  { id: 'field-1', label: 'Name', type: 'text' },
  { id: 'field-2', label: 'Age', type: 'number' },
  { id: 'field-3', label: 'Gender', type: 'radio', options: ['Male', 'Female', 'Other'] },
  { id: 'field-4', label: 'Favorite Colors', type: 'checkbox', options: ['Red', 'Green', 'Blue'] },
  { id: 'field-5', label: 'Country', type: 'dropdown', options: ['USA', 'Canada', 'UK'] },
  { id: 'field-6', label: 'Upload File', type: 'upload' },
  { id: 'field-7', label: 'Appointment Date', type: 'datetime' },
];

function App() {
  const formTitle = "Sample Form";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormBuilder />} />
        <Route path="/form" element={<FormDisplay title={formTitle} fields={staticFields} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
