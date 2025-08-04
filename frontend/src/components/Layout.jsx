import React, { useState } from 'react'
import { SignOutButton, UserProfile, UserButton } from '@clerk/clerk-react'
import Sidebar from '../templates/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(true)
  return (
    <>
    <section className='w-full min-h-screen flex'>
      <Sidebar/>
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
  )
}

export default Layout