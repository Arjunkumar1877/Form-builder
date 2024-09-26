import './App.css';
import FormBuilder from './components/FormBuilder';
import FormResponsesDisplay from './components/FormResponsesDisplay';
import UserProtectRoutes from './components/UserProtectRoutes';
import Form from './pages/Form';
import FormListPage from './pages/FormListPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Success from './pages/Success';


function App() {


  return (
    <BrowserRouter>
    <ToastContainer />
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/form" element={<Form />} />
        <Route path="/success" element={<Success />} />
       <Route element={<UserProtectRoutes />} >
      
       <Route path="/response" element={<FormResponsesDisplay />} />
        <Route path="/add_form" element={<FormBuilder />} />
       <Route path='/form_list' element={<FormListPage />} />
       </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
