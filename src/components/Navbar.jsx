import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import  useAuth  from '../hooks/UseAuth';
import ThemeToggle from '../utils/theme/Theme';
import { Menu,X } from 'lucide-react';



const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const mobileRef=useRef();
  const[mobile,setmobile]=useState(false);
  
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

  useEffect(()=>{
   const handleClickOutside = (event) => {
      if (window.innerWidth >= 1024) return
      const clickedButton = mobileRef.current && mobileRef.current.contains(event.target);

      if (clickedButton) {
        // Toggle sidebar on button click
        setmobile(prev => !prev);
      } else{
        // Close if clicked outside both button and sidebar
        if (mobile) {
          setmobile(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);

  },[mobile])


const ForMobile=()=>{
  return(
      <div className={`dark:bg-black  bg-white h-fit w-fit z-[999] rounded-md transition-all duration-1000 overflow-hidden  fixed top-14 right-0 ${
                        mobile ? "min-h-[30vh] p-4 max-h-[1000px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
                     }  `}>
        <ul>
         <li className='w-fit relative'>
            <NavLink to="/products" className={({isActive})=>isActive?"active":"in-active"}>
              Products
            </NavLink>
          </li>
        </ul>

          {user ? (
 
                <div className=" relative  mt-2 w-48 bg-white dark:bg-gray-900  rounded-md shadow-lg py-1 z-20">
                   <img
                      src={user.photoURL || 'https://via.placeholder.com/40'}
                      alt="User Profile"
                      referrerPolicy='no-referrer'
                      className="w-10 h-10 rounded-full absolute top-1 right-1"
                    />
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
          ) : (
            <ul className="">
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
       </div>
    )
}

  return (
    <nav className="w-full fixed z-[999] ">
      <ForMobile></ForMobile>
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
          <li ref={mobileRef} className='md:hidden inline-flex items-center justify-center' >
            <button 
              className='text-center text-black dark:text-white'>
              {!mobile?<Menu></Menu>:<X></X>}
            </button>
          </li>
                <li className='w-fit relative hidden md:block'>
                  <NavLink to="/products" className={({isActive})=>isActive?"active":"in-active"}>
                    Products
                  </NavLink>
                </li>

                {user ? (
                  <div className="relative md:block hidden">
                    <img
                      src={user.photoURL || 'https://via.placeholder.com/40'}
                      alt="User Profile"
                      referrerPolicy='no-referrer'
                      className="w-10 h-10 rounded-full cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900  rounded-md shadow-lg py-1 z-20">
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
                    <li className='w-fit relative md:block hidden'>
                        <NavLink to="/login" className={({isActive})=>isActive?"active":"in-active"}>
                          Login
                        </NavLink>
                    </li>
                    <li className='w-fit relative md:block hidden'>
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