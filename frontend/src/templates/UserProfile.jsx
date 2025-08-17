import React from 'react'
import { useUser } from '@clerk/clerk-react'
import moment from "moment"

const UserProfile = ({user, posts, setShowEdit, profileId}) => {
    const { user : realUser} = useUser()
    console.log(realUser.id)
  return (
    <div className='relative py-4 px-6 md:px-8 font-[absans] bg-[#1A1D24] backdrop-blur-sm border border-gray-800/50 rounded-xl'>
    <div className='flex flex-col md:flex-row items-start gap-6'>


    <div className='w-32 h-32 border-4 border-gray-700 shadow-2xl absolute -top-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20'>
      <img 
        src={user.profile_picture} 
        alt="" 
        className='absolute rounded-full z-21 ring-2 ring-purple-500/30' 
      />
    </div>

    <div className='w-full pt-16 md:pt-10 md:pl-36'>
        <div className='flex flex-col md:flex-row items-start justify-between'>
            <div>
                <div className='flex items-center gap-3'>
                    <h2 className='text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent'> {user.full_name.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} </h2>
                    <i className="text-xl ri-verified-badge-fill text-blue-400"></i>
                </div>
                <p className='text-gray-400'> {
                    user.username ? `@${user.username}` : "Add a username" } </p>
            </div>
            {/* if user is on his profile */}
            {
                (realUser.id === profileId || !profileId) && (
                    <button
                    className='flex items-center gap-2 border border-gray-600 hover:border-purple-500 hover:bg-purple-500/10 bg-gray-800/50 px-4 py-2 rounded-lg font-medium transition-all duration-200 mt-4 md:mt-0 text-gray-200 hover:text-purple-300'
                    onClick={()=>setShowEdit(true)}>
                        <i class="ri-edit-box-fill"></i>
                        Edit
                    </button>
                )
            }
        </div>
        <p className='text-gray-300 text-sm max-x-md mt-4'> {user.bio} </p>

        <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 mt-4'>
            <span className='flex font-bold items-center gap-1.5'>
                <i className="text-xl ri-map-pin-user-fill text-red-400"></i>
                {user.location ? user.location : "Add Location"}
            </span>
            <span className='flex font-bold items-center gap-1.5'>
                <i class="text-xl ri-calendar-2-line text-emerald-400"></i>
                Joined {moment(user.createdAt).fromNow()}
            </span>
        </div>

        <div className='flex items-center gap-6 mt-6 border-t border-gray-700/50 pt-4'>
            <div className='hover:scale-105 transition-transform duration-200'>
                <span className='sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'> {posts.length} </span>
                <span className='text-xs sm:text-sm text-gray-500 ml-1.5'> Posts </span>
            </div>
            <div className='hover:scale-105 transition-transform duration-200'>
                <span className='sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'> {user.followers.length} </span>
                <span className='text-xs sm:text-sm text-gray-500 ml-1.5'> Followers </span>
            </div>
            <div className='hover:scale-105 transition-transform duration-200'>
                <span className='sm:text-xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent'> {user.following.length} </span>
                <span className='text-xs sm:text-sm text-gray-500 ml-1.5'> Following </span>
            </div>
        </div>

    </div>

    </div>
    </div>

  )
}

export default UserProfile