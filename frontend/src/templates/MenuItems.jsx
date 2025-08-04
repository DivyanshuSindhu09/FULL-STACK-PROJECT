import React from 'react'
import { menuItemsData } from '../../public/assets/assets'
import { NavLink } from 'react-router-dom'

const MenuItems = ({setSideBarOpen}) => {
  return (
    <div className='px-6 text-gray-600 font-[absans] text-xl space-y-1 font-medium'>
        {
            menuItemsData.map(({to, label, Icon},index)=>(
                <NavLink
                onClick={() => setSideBarOpen(false)}
                key={index} to={to} className={({isActive}) => `flex items-center gap-4 p-2 rounded-md hover:bg-gray-100 ${isActive ? 'bg-gray-200' : ''}`}>
                    {Icon}
                    <span className='text-xl'>{label}</span>
                </NavLink>
            ))
        }
    </div>
  )
}

export default MenuItems