import React, { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Hader from '../components/Hader'
import Sidebar from '../components/Sidebar'

const Dashboardlayout = () => {
  const location = useLocation();
  const scrollContainerRef = useRef();
  useEffect(()=>{
      window.scrollTo(0,0);
          if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo(0, 0);
    }
  },[location])
  return (
    <div className='dashboardlayout'>
           <Sidebar></Sidebar>
        <div className='flex-1 h-full overflow-hidden bg-gray-400 dark:bg-[#504d54]'>
            <Hader></Hader>
            <div  ref={scrollContainerRef} className='w-full h-full overflow-auto px-2 pt-4 pb-25'>
                <Outlet></Outlet>
            </div>
         </div>

    </div>
  )
}

export default Dashboardlayout