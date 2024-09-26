import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOutSuccess } from '../redux/userSlice';
import Swal from 'sweetalert2';
import { FiLogOut } from 'react-icons/fi';

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
    <header className="bg-white p-4 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">
          <Link to="/" className="text-black text-3xl">Forms.</Link>
        </h1>
        <nav className="flex flex-wrap items-center space-x-4">
          {location.pathname !== '/add_form' && (
            <Link
              to="/add_form"
              className="px-3 py-2 hover:text-slate-400 hover:border-slate-400 rounded text-black border border-gray-700 transition duration-300"
            >
              Add Form
            </Link>
          )}
          {location.pathname !== '/form_list' && (
            <Link
              to="/form_list"
              className="px-3 py-2 hover:text-slate-400 hover:border-slate-400 rounded text-black border border-gray-700 transition duration-300"
            >
              See Forms
            </Link>
          )}
          <h1 className="text-md font-thin text-black">{currentUser?.name}</h1>
          <button
            onClick={handleLogout}
            className="bg-transparent p-2 rounded transition duration-300"
          >
            <FiLogOut className="text-black text-2xl hover:text-red-500" />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
