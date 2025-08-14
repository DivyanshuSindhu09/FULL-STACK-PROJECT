import React, { useState } from 'react'
import { SignOutButton, UserProfile, UserButton } from '@clerk/clerk-react'
import Sidebar from '../templates/Sidebar'
import { Outlet } from 'react-router-dom'
import { dummyUserData } from '../../public/assets/assets'
import MenuItems from '../templates/MenuItems'
import { useSelector } from 'react-redux'
import Loading from '../templates/Loading'

const Layout = () => {
  //! const user = dummyUserData (ab use hoga store se)
  
  const user = useSelector((state)=>state.user.value)
  const [sideBarOpen, setSideBarOpen] = useState(true)
  return user ? (
    <>
    <section className='w-full min-h-screen flex'>

      <Sidebar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />

      <div className='flex-1 bg-slate-900'>
        <Outlet/>
      </div>
      {
        sideBarOpen ?
        (<i className="ri-close-circle-line absolute top-3 right-3 p-2 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden" onClick={()=>setSideBarOpen(false)}></i>) 
        : (<i className="ri-menu-2-line absolute top-3 right-3 p-2 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden" onClick={()=>setSideBarOpen(true)}></i>)
      }
    
    </section>
    </>
  ) : <Loading/>
}

export default Layout