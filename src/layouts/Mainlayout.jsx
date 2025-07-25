import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const routeTitles = {
      '/': 'Home - AppOrbit',
      '/products': 'All Products - AppOrbit',
      '/login': 'Login - AppOrbit',
      '/register': 'Register - AppOrbit',
};

const Mainlayout = () => {
  const location = useLocation();
  useEffect(()=>{
    window.scrollTo(0,0);
    document.title=routeTitles[location.pathname] || "AppOrbit."
  },[location])
  return (
    <div className='w-full h-full dark:bg-gray-800 bg-white'>
        <Navbar></Navbar>
         <div className='w-full min-h-screen md:pt-20 pt-16 flex flex-col items-center justify-start '>
            <Outlet></Outlet>
         </div>
         <Footer></Footer>
    </div>
  )
}

export default Mainlayout
