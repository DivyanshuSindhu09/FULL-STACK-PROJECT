import React from 'react'
import { dummyUserData } from '../../public/assets/assets'

const UserCard = ({ user }) => {
  const currentUser = dummyUserData

  const handleFollow = async () => {}
  const handleConnectionRequest = async () => {}

  return (
    <div
      key={user._id}
      className="p-5 pt-6 flex flex-col justify-between w-72
                 border border-slate-700 rounded-xl
                 bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#111827]
                 font-[absans] transition-all duration-300 
                 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10
                 relative overflow-hidden"
    >
      {/* Profile */}
      <div className="text-center relative z-10">
        <div className="relative w-fit mx-auto group">
          <img
            src={user.profile_picture}
            alt=""
            className="rounded-full w-16 h-16 mx-auto border-2 border-purple-400/60
                       transition-all duration-300 group-hover:border-purple-400"
          />
          <div className="absolute inset-0 rounded-full border border-purple-500/40 
                          opacity-0 group-hover:opacity-100 transition duration-500 
                          blur-md"></div>
        </div>

        <p className="mt-4 font-semibold text-white">{user.full_name}</p>
        {user.username && (
          <p className="text-purple-300 font-light">@{user.username}</p>
        )}
        {user.bio && (
          <p className="text-slate-400 mt-2 text-center text-sm px-4 leading-snug">
            {user.bio}
          </p>
        )}
      </div>

      {/* Location & Followers */}
      <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-300">
        <div className="flex items-center gap-1 border border-slate-600 rounded-full px-3 py-1 bg-slate-800/50">
          <i className="ri-map-pin-2-line text-purple-400"></i>
          <p>{user.location}</p>
        </div>
        <div className="flex items-center gap-1 border border-slate-600 rounded-full px-3 py-1 bg-slate-800/50">
          <p>{user.followers.length} Follower</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex mt-4 gap-2 relative z-10">
        {/* Follow Button */}
        <button
          onClick={handleFollow}
          disabled={currentUser?.following.includes(user._id)}
          className="w-full py-2 rounded-md flex justify-center items-center gap-2 
                     bg-gradient-to-r from-purple-500 to-indigo-500
                     hover:from-purple-600 hover:to-indigo-600
                     active:scale-95 transition text-white font-medium
                     disabled:opacity-50 shadow-sm hover:shadow-md hover:shadow-purple-500/20"
        >
          <i className="ri-user-add-line"></i>
          {currentUser?.following.includes(user._id) ? 'Following' : 'Follow'}
        </button>

        {/* Connection / Message */}
        <button
          onClick={handleConnectionRequest}
          className="flex items-center justify-center w-16
                     border border-slate-600 text-purple-300 rounded-md
                     cursor-pointer active:scale-95 transition 
                     bg-slate-800/50 hover:bg-slate-700/50
                     hover:text-white shadow-sm hover:shadow-md hover:shadow-purple-500/20"
        >
          {currentUser?.connections.includes(user._id) ? (
            <i className="ri-chat-3-line"></i>
          ) : (
            <i className="ri-add-fill"></i>
          )}
        </button>
      </div>
    </div>
  )
}

export default UserCard
