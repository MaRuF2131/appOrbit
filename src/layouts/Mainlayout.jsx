import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const Mainlayout = () => {
  const location = useLocation();
  useEffect(()=>{
    document.title = 'Vite Project'
    window.scrollTo(0,0)
  },[location])
  return (
    <div className='w-full h-full dark:bg-gray-800 bg-white'>
        <Navbar></Navbar>
         <div className='w-full min-h-screen pt-20 flex flex-col items-center justify-start '>
            <Outlet></Outlet>
         </div>
         <Footer></Footer>
    </div>
  )
}

export default Mainlayout
