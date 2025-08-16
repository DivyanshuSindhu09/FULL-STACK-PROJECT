import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { UserButton, useClerk } from '@clerk/clerk-react'
import { dummyUserData } from '../../public/assets/assets'
import { useSelector } from 'react-redux'

const Sidebar = ({ sideBarOpen, setSideBarOpen }) => {
  // const user = dummyUserData
  const user = useSelector((state)=>state.user.value)
  const navigate = useNavigate()
  const { signOut } = useClerk()

  return (
    <section
      className={`w-60 xl:72 bg-[#0e1525] h-screen overflow-hidden border-r-6 border-[#1e293b] flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${
        sideBarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'
      } transition-all duration-300 ease-in-out`}
    >
      <div className='w-full'>
        <h2
          onClick={() => navigate('/')}
          className='text-5xl py-4 px-7 cursor-pointer text-white font-black font-[acma-black]'
        >
          Axora
        </h2>
        <hr className='border-[#334155] font-black mb-8' />

        <MenuItems setSideBarOpen={setSideBarOpen} />

        <Link
          className='flex items-center gap-4 p-2 mt-6 mx-6 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 active:scale-95 transition text-white cursor-pointer font-[absans] text-xl font-medium shadow-[0_0_15px_rgba(168,85,247,0.7)] hover:shadow-[0_0_25px_rgba(6,182,212,0.9)]'
          to='/create-post'
        >
          <i className='ri-add-circle-line'></i>
          Create Post
        </Link>
      </div>

      <div className='w-full border-t border-[#1e293b] py-4 px-2 flex items-center justify-between'>
        <div className='flex gap-2 items-center cursor-pointer'>
          <UserButton
          appearance={{
            elements : {
              dangerSection : {display   : "none"}
            }
          }}
          />
          <div>
            <h2 className='text-lg font-[absans] text-white'>{user.full_name.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h2>
            <p className='text-sm text-gray-400 font-[absans]'>@{user.username}</p>
          </div>
        </div>
        <i
          onClick={signOut}
          className='text-xl text-gray-400 hover:text-white cursor-pointer ri-logout-box-r-line'
        ></i>
      </div>
    </section>
  )
}

export default Sidebar
