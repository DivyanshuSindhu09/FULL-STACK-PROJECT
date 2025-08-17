import React from 'react'
import { dummyUserData } from '../../public/assets/assets'
import { useDispatch, useSelector } from 'react-redux'
import {useAuth} from "@clerk/clerk-react"
import {useNavigate} from "react-router-dom"
import api from '../api/axios'
import toast from "react-hot-toast"
import { fetchUser } from '../features/user/userSlice'

const UserCard = ({ user }) => {

  const currentUser = useSelector((state)=>state.user.value)

  const {getToken} = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()  
  //!const currentUser = dummyUserData


  const handleFollow = async () => {
    const token = await getToken()
    try {
      const {data} = await api.post('/api/user/follow', {id:user._id},{
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      if(data.success){
        toast.success(data.message)
        dispatch(fetchUser(token))
      }else{
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(error.message)
      
    }
  }
  const handleConnectionRequest = async () => {
  const token = await getToken()

  //? agar already connected hai to direct messages page pe bhej do
  if (currentUser.connections.includes(user._id)) {
    return navigate('/messages/' + user._id)
  }

  try {
    const { data } = await api.post(
      '/api/user/connect',
      { id: user._id },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (data.success) {
      toast.success(data.message) // ✅ "Connection request sent successfully"
      dispatch(fetchUser(token))
    } else {
      if (data.message === "Connection request already pending") {
        // ℹ️ Info toast (blue style)
        toast(data.message, {
          icon: 'ℹ️',
          style: {
            background: '#2563eb',
            color: '#fff'
          }
        })
      } else {
        toast.error(data.message || "Something went wrong")
      }
    }
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message
    if (errMsg === "Connection request already pending") {
      toast("Connection request already sent", {
        icon: 'ℹ️',
        style: {
          background: '#2563eb',
          color: '#fff'
        }
      })
    } else {
      toast.error(errMsg)
    }
  }
}

  return (
    <div
      key={user._id}
      className="p-5 pt-6 flex flex-col justify-between w-80
                 border border-purple-400/30 rounded-2xl
                 bg-gradient-to-b from-slate-800/80 via-gray-800/80 to-slate-800/80
                 font-[absans] transition-all duration-300 backdrop-blur-xl
                 shadow-2xl hover:shadow-2xl hover:shadow-purple-500/20
                 relative overflow-hidden hover:border-cyan-400/40"
    >
      {/* Subtle background gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-60'></div>
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/5 via-transparent to-transparent'></div>

      {/* Profile */}
      <div className="text-center relative z-10">
        <div className="relative w-fit mx-auto group">
          <img
            src={user.profile_picture}
            alt=""
            className="rounded-full w-16 h-16 mx-auto border-2 border-cyan-400/60
                       transition-all duration-300 group-hover:border-purple-400 shadow-lg"
          />
          <div className="absolute inset-0 rounded-full border border-cyan-500/40 
                          opacity-0 group-hover:opacity-100 transition duration-500 
                          blur-md"></div>
        </div>

        <p className="mt-4 font-semibold text-white">{user.full_name}</p>
        {user.username && (
          <p className="text-cyan-300 font-light">@{user.username}</p>
        )}
        {user.bio && (
          <p className="text-gray-300 mt-2 text-center text-sm px-4 leading-snug">
            {user.bio}
          </p>
        )}
      </div>

      {/* Location & Followers */}
      <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-300">
        <div className="flex items-center gap-1 border border-purple-400/30 rounded-full px-3 py-1 bg-slate-900/60 backdrop-blur-sm">
          <i className="ri-map-pin-2-line text-cyan-400"></i>
          <p>{user.location}</p>
        </div>
        <div className="flex items-center gap-1 border border-purple-400/30 rounded-full px-3 py-1 bg-slate-900/60 backdrop-blur-sm">
          <p>{user.followers.length} Follower</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex mt-4 gap-2 relative z-10">
        {/* Follow Button */}
        <button
          onClick={handleFollow}
          disabled={currentUser?.following.includes(user._id)}
          className="w-full py-2 rounded-xl flex justify-center items-center gap-2 
                     bg-gradient-to-r from-cyan-500 to-purple-500
                     hover:from-cyan-600 hover:to-purple-600
                     active:scale-95 transition text-white font-medium
                     disabled:opacity-50 shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
        >
          <i className="ri-user-add-line"></i>
          {currentUser?.following.includes(user._id) ? 'Following' : 'Follow'}
        </button>

        {/* Connection / Message */}
        <button
          onClick={handleConnectionRequest}
          className="flex items-center justify-center w-16
                     border border-purple-400/30 text-cyan-300 rounded-xl
                     cursor-pointer active:scale-95 transition 
                     bg-slate-900/60 hover:bg-slate-800/60 backdrop-blur-sm
                     hover:text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:border-cyan-400/40"
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