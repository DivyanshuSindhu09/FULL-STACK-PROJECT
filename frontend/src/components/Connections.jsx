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
    <section className='max-h-screen overflow-y-scroll no-scrollbar font-[absans]'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* title */}
        
        <div className="mb-8">
          <h1 className="text-3xl font-[acma-black] text-white mb-2">Connections</h1>
          <p className="font-[absans] text-gray-300">Manage your network and discover new connections!</p>
        </div>

        {/* counts */}
        <div className='mb-8 flex flex-wrap gap-5'>
          {
            dataArray.map((item, index) => (
              <div 
              className='flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md'
              key={index}>
                <b> {item.value.length} </b>
                <p className='text-slate-600'> {item.label} </p>
              </div>
            ))
          }
        </div>

        {/* tabs */}
        <div className='inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm'>
          {
            dataArray.map((tab)=>(
              <button
              onClick={()=>setCurrentTab(tab.label)}
              key={tab.label}
              className={`flex cursor-pointer items-center px-3 py-1 text-sm rounded-md transition-colors ${
              currentTab === tab.label ? 'bg-white font-medium text-black' : 'text-gray-500 hover:text-black'
              }`}>
                <span className='text-xl'>{tab.icon}</span>
                <span className='ml-1'> {tab.label} </span>
                {
                  tab.count !== undefined && (
                    <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full
                    '> {tab.count} </span>
                  )
                }
              </button>
            ))
          }
        </div>

        {/* connections */}

        <div className='flex flex-wrap gap-6 mt-6'>
        {dataArray.find((item)=>item.label === currentTab).value.map((user)=>(
          <div key={user.user_id} className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>
            <img src={user.profile_picture} alt="" className="rounded-full w-12 h-12 shadow-md mx-auto"/>
            <div className='flex-1'>
              <p className="font-medium text-slate-700">{user.full_name}</p>
              <p className="text-slate-500">@{user.username}</p>
              <p className="text-sm text-gray-600">{user.bio.slice(0, 30)}...</p>
              <div className='flex max-sm:flex-col gap-2 mt-4'>
                {
                  <button
                  onClick={()=>navigate(`/profile/${user._id}`)}
                  className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'
                  >View Profile</button>
                }

                {
                  currentTab === "Following" && (
                    <button
                    onClick={()=>handleUnfollow(user._id)}
                    className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'>
                      Unfollow
                    </button>
                  )
                }

                {
                  currentTab === "Pending" && (
                    <button 
                    onClick={()=>acceptConnection(user._id)}
                    className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'>
                      Accept
                    </button>
                  )
                }

                {
                  currentTab === "Connections" && (
                    <button 
                    onClick={()=>navigate(`/messages/${user._id}`)}
                    className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1'>
                      <i className="ri-chat-new-fill"></i>
                      Message
                    </button>
                  )
                }

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