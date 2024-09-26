import './App.css';
import FormBuilder from './components/FormBuilder';
import Form from './pages/Form';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {


  return (
    <BrowserRouter>
    <ToastContainer />
      <Routes>

        <Route path="/" element={<FormBuilder />} />
        <Route path="/form" element={<Form />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
