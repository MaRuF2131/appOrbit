import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import  useAuth  from '../hooks/UseAuth';
import ThemeToggle from '../utils/theme/Theme';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  console.log('userrrr',user);
  

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="w-full fixed z-[999] ">

      <div className="_navbar ">
        <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white/70">
          AppOrbit<span className="text-blue-400">.</span>
        </Link>
        <ul className="_navbar_link_div">
          <li>
             <ThemeToggle></ThemeToggle>
          </li>
          <li className='w-fit relative'>
              <NavLink to="/" className={({isActive})=>isActive?"active":"in-active"}>
               Home
             </NavLink>
          </li>
          <li className='w-fit relative'>
            <NavLink to="/products" className={({isActive})=>isActive?"active":"in-active"}>
              Products
            </NavLink>
          </li>

          {user ? (
            <div className="relative">
              <img
                src={user.photoURL || 'https://via.placeholder.com/40'}
                alt="User Profile"
                referrerPolicy='no-referrer'
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <span className="_navbar_dropdown_list opacity-45">{user.displayName || user.email}</span>
                  <Link
                    to="/dashboard"
                    className="_navbar_dropdown_list hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="_navbar_dropdown_list hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <ul className="_navbar_link_div">
              <li className='w-fit relative'>
                  <NavLink to="/login" className={({isActive})=>isActive?"active":"in-active"}>
                    Login
                  </NavLink>
              </li>
              <li className='w-fit relative'>
                 <NavLink to="/register" className={({isActive})=>isActive?"active":"in-active"}>
                  Register
                </NavLink>
              </li>

            </ul>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;