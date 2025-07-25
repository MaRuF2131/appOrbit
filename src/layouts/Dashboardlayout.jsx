import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Hader from '../components/Hader';
import Sidebar from '../components/Sidebar';
import { Menu, X } from 'lucide-react';

const routeTitles = {
      '/': 'Home-AppOrbit',
      '/dashboard': 'Dashboard - AppOrbit',
      '/dashboard/My%20Profile': 'My Profile - AppOrbit',
      '/dashboard/My%20Products': 'My Products - AppOrbit',
      '/dashboard/Add%20Products': 'Add Products - AppOrbit',
      '/dashboard/Manage%20Users': 'Manage Users - AppOrbit',
      '/dashboard/Manage%20Coupons': 'Manage Coupons - AppOrbit',
      '/dashboard/Product%20Review': 'Product Review - AppOrbit',
      '/dashboard/Reported%20Contents': 'Reported Contents - AppOrbit',
    };

const Dashboardlayout = () => {
  const location = useLocation();
  const scrollContainerRef = useRef();
  const buttonRef = useRef();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Detect screen resize to set initial sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }

    document.title = routeTitles[location.pathname] || 'AppOrbit';
  }, [location]);

  // Detect outside click to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth >= 1024) return
      const clickedButton = buttonRef.current && buttonRef.current.contains(event.target);

      if (clickedButton) {
        // Toggle sidebar on button click
        setSidebarOpen(prev => !prev);
      } else{
        // Close if clicked outside both button and sidebar
        if (sidebarOpen) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="dashboardlayout ">
      {/* Sidebar */}
      {sidebarOpen && (
          <Sidebar />
      )}

      {/* Main Content */}
        {/* Header */}
        <div ref={buttonRef} className="flex fixed z-[1000] top-15 left-0 lg:hidden items-center justify-between p-2">
          {/* Hamburger Button */}
          <button
            className="lg:hidden dark:text-white text-black"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
             <div className='flex-1 h-full overflow-hidden bg-gray-400 dark:bg-[#504d54]'>
                <Hader></Hader>
                {/* Page Content */}
                <div ref={scrollContainerRef} className="w-full h-full overflow-auto md:px-2 pt-4 pb-24">
                <Outlet />
                </div>
            </div>
      </div>
  );
};

export default Dashboardlayout;
