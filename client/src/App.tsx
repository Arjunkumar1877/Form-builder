
import './App.css'
import FormBuilder from './components/FormBuilder'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
    
    <Routes>

<Route path='/' element={<FormBuilder />} />
    <Route path='/signup' element={<Signup />} />
    <Route path='/login' element={<Login />} />

    </Routes>

    </BrowserRouter>
  )
}

export default App
