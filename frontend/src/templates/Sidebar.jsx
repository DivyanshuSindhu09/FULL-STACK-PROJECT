import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { UserButton, useClerk } from '@clerk/clerk-react'
import { dummyUserData } from '../../public/assets/assets'

const Sidebar = ({sideBarOpen, setSideBarOpen}) => {
  const user = dummyUserData
  const navigate = useNavigate()
  const {signOut} = useClerk()
  return (
    <section className={`w-60 xl:72 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${sideBarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full' } transition-all duration-300 ease-in-out `}>

    <div className='w-full '>
      <h2
      onClick={() => navigate('/')}
      className='text-5xl py-4 px-7 cursor-pointer text-gray-600 font-black font-[acma-black]'>Axora</h2>
      <hr className='border-gray-300 font-black mb-8' />

    <MenuItems setSideBarOpen={setSideBarOpen} />
    
    <Link className='flex items-center gap-4 p-2 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer font-[absans] text-xl font-medium' to='/create-post'>
    <i className="ri-add-circle-line"></i>
    Create Post
    </Link>
    </div>

    <div className='w-full border-t border-gray-200 py-4 px-2 flex items-center justify-between'>
      <div className='flex gap-2 items-center cursor-pointer'>
        <UserButton />
        <div>
        <h2 className='text-lg font-[absans]'> {user.full_name} </h2>
        <p className='text-sm text-gray-500 font-[absans]'> @{user.username} </p>
        </div>
      </div>
      <i
      onClick={signOut}
      className="text-xl cursor-pointer ri-logout-box-r-line"></i>
    </div>

    </section>
  )
}

export default Sidebar