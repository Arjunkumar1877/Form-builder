import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOutSuccess } from '../redux/userSlice';
import Swal from 'sweetalert2';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser } = useSelector((state: any) => state.user);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, log me out!',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('User logged out');
        dispatch(signOutSuccess());
        navigate("/");
      }
    });
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">
          <Link to="/" className="hover:underline">Form Builder</Link>
        </h1>
        <nav className="flex flex-wrap items-center space-x-4">
          <Link 
            to="/add_form" 
            className={`px-3 py-2 rounded transition duration-300 ${location.pathname === '/add_form' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            Add Form
          </Link>
          <Link 
            to="/form_list" 
            className={`px-3 py-2 rounded transition duration-300 ${location.pathname === '/form_list' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            See Forms
          </Link>
          <h1 className="text-lg font-semibold">{currentUser?.name}</h1>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded transition duration-300"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
