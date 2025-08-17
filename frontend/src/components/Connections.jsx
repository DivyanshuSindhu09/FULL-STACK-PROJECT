import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections
} from "../../public/assets/assets"
import { useDispatch, useSelector } from "react-redux"
import { useAuth } from "@clerk/clerk-react"
import { fetchConnections } from '../features/connections/connectionSlice'
import api from '../api/axios'
import toast from 'react-hot-toast'

const Connections = () => {
  //! heavy component

  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState('Followers')

  const {connections, pendingConnections, followers, following} = useSelector((state) => state.connections)
  const {getToken} = useAuth()
  const dispatch = useDispatch()


  const dataArray = [
    {
      label : "Followers",
      value : followers,
      icon : <i className="ri-user-3-line"></i>
    },
    {
      label : "Following",
      value : following,
      icon : <i className="ri-user-follow-line"></i>
    },
    {
      label : "Pending",
      value : pendingConnections,
      icon : <i className="ri-user-shared-2-line"></i>
    },
    {
      label : "Connections",
      value : connections,
      icon : <i className="ri-group-fill"></i>
    }
  ]

  const handleUnfollow = async(userId) => {
    const token = await getToken()
    try {
      const {data} = await api.post('/api/user/unfollow', {
        unfollowUserID : userId
      }, {
        headers : {
          Authorization : `Bearer ${token}`
        }
      })

      if(data.success){
        toast.success(data.message)
        dispatch(fetchConnections(token))
      }else{
        toast(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  const acceptConnection = async(userId) => {
    const token = await getToken()
    try {
      const {data} = await api.post('/api/user/accept', {
        id : userId
      }, {
        headers : {
          Authorization : `Bearer ${token}`
        }
      })

      if(data.success){
        toast.success(data.message)
        dispatch(fetchConnections(token))
      }else{
        toast(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    getToken().then((token) => {
      dispatch(fetchConnections(token))
    })
  }, [])

  return (
    <section className='max-h-screen overflow-y-scroll no-scrollbar font-[absans] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 min-h-screen relative overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent'></div>
      <div className='absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]'></div>
      
      <div className='relative z-10 max-w-6xl mx-auto p-6'>
        {/* title */}
        
        <div className="mb-8">
          <h1 className="text-4xl font-[acma-black] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-2xl mb-3">Connections</h1>
          <p className="font-[absans] text-gray-300 text-lg">Manage your network and discover new connections!</p>
        </div>

        {/* counts */}
        <div className='mb-8 flex flex-wrap gap-5'>
          {
            dataArray.map((item, index) => (
              <div 
              className='flex flex-col items-center justify-center gap-2 border h-24 w-44 border-purple-400/30 bg-gradient-to-br from-slate-800/80 via-gray-800/80 to-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 relative overflow-hidden'
              key={index}>
                <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5'></div>
                <div className='relative flex flex-col z-10'>
                  <b className='text-xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400'> {item.value.length} </b>
                  <p className='text-gray-300 font-medium'> {item.label} </p>
                </div>
              </div>
            ))
          }
        </div>

        {/* tabs */}
        <div className='inline-flex flex-wrap items-center border border-purple-400/30 rounded-2xl p-1.5 bg-gradient-to-r from-slate-800/80 via-gray-800/80 to-slate-800/80 backdrop-blur-xl shadow-xl shadow-purple-500/20'>
          {
            dataArray.map((tab)=>(
              <button
              onClick={()=>setCurrentTab(tab.label)}
              key={tab.label}
              className={`flex cursor-pointer items-center px-4 py-2.5 text-sm rounded-xl transition-all duration-300 font-medium ${
              currentTab === tab.label ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`}>
                <span className='text-lg'>{tab.icon}</span>
                <span className='ml-2'> {tab.label} </span>
                {
                  tab.count !== undefined && (
                    <span className='ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full
                    '> {tab.count} </span>
                  )
                }
              </button>
            ))
          }
        </div>

        {/* connections */}

        <div className='flex flex-wrap gap-6 mt-8'>
        {dataArray.find((item)=>item.label === currentTab).value.map((user, index)=>(
          <div key={index} className='w-full max-w-88 flex gap-5 p-6 bg-gradient-to-br from-slate-800/80 via-gray-800/80 to-slate-800/80 backdrop-blur-xl border border-purple-400/30 rounded-2xl shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 relative overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5'></div>
            <div className='relative z-10 flex gap-5 w-full'>
              <img src={user?.profile_picture} alt="" className="rounded-full w-12 h-12 border-2 border-cyan-400/50 shadow-lg"/>
              <div className='flex-1'>
                <p className="font-semibold text-white">{user?.full_name}</p>
                <p className="text-cyan-300">@{user?.username}</p>
                <p className="text-sm text-gray-300 mt-1">{user?.bio.slice(0, 30)}...</p>
                <div className='flex max-sm:flex-col gap-2 mt-4'>
                  {
                    <button
                    onClick={()=>navigate(`/profile/${user?._id}`)}
                    className='w-full p-2.5 text-sm rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 active:scale-95 transition-all duration-300 text-white cursor-pointer font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/25'
                    >View Profile</button>
                  }

                  {
                    currentTab === "Following" && (
                      <button
                      onClick={()=>handleUnfollow(user?._id)}
                      className='w-full p-2.5 text-sm rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-gray-200 hover:text-white active:scale-95 transition-all duration-300 cursor-pointer border border-gray-600/50 backdrop-blur-sm font-medium'>
                        Unfollow
                      </button>
                    )
                  }

                  {
                    currentTab === "Pending" && (
                      <button 
                      onClick={()=>acceptConnection(user._id)}
                      className='w-full p-2.5 text-sm rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-gray-200 hover:text-white active:scale-95 transition-all duration-300 cursor-pointer border border-gray-600/50 backdrop-blur-sm font-medium'>
                        Accept
                      </button>
                    )
                  }

                  {
                    currentTab === "Connections" && (
                      <button 
                      onClick={()=>navigate(`/messages/${user._id}`)}
                      className='w-full p-2.5 text-sm rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-gray-200 hover:text-white active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-gray-600/50 backdrop-blur-sm font-medium'>
                        <i className="ri-chat-new-fill"></i>
                        Message
                      </button>
                    )
                  }

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      </div>
    </section>
  )
}

export default Connections