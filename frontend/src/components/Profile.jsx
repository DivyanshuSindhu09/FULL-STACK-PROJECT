import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom"
import { dummyPostsData, dummyUserData } from '../../public/assets/assets'
import Loading from '../templates/Loading'
import UserProfile from '../templates/UserProfile'
import PostCard from '../templates/PostCard'
import moment from 'moment'
import ProfileEditModel from '../templates/ProfileEditModel'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from "react-hot-toast"
import { useSelector } from 'react-redux'



const Profile = () => {

  const currentUser = useSelector((state)=>state.user.value)

  const {profileId} = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  // const fetchUser = async () => {
  //   setUser(dummyUserData)
  //   setPosts(dummyPostsData)
  // }

  const {getToken} = useAuth()
  const fetchUser = async (profileId) => {
  const token = await getToken()

    try {
      console.log("func first")
      const {data} = await api.post(`/api/user/profiles`, {profileId}, {
        headers : {Authorization: `Bearer ${token}`}
      })
      console.log("funcn second")
      console.log(data)
      if(data.success){
        setUser(data.profile)
        setPosts(data.posts)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(profileId){
      fetchUser(profileId)
    }else{
      fetchUser(currentUser._id)
    }
  }, [profileId, currentUser])
  
  return user ? (
    <section className='relative max-h-screen font-[absans] overflow-y-scroll no-scrollbar p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* profile card */}
        <div className='bg-[#1A1D24] rounded-2xl shadow overflow-hidden'>
          {/* cover photo */}
          <div className='md:h-56 lg:h-36  bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
            {
              user.cover_picture && (
                <img
                className='w-full h-full object-cover'
                src={user.cover_picture} />
              )
            }
          </div>
          {/* user info */}
          <UserProfile user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>
        {/* tabs */}
        <div className='mt-4'>
            <div className='bg-[#1A1D24] overflow-hidden rounded-2xl shadow-2xl shadow-purple-500/20 p-1.5 flex max-w-md mx-auto border border-purple-500/20 backdrop-blur-sm'>
  {
    ['posts', 'media', 'likes'].map((tab, index) => (
      <button
      onClick={()=>setActiveTab(tab)}
      className={`group relative flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
        activeTab === tab 
          ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-purple-500/30 scale-105 border border-purple-400/50" 
          : "text-gray-400 border border-transparent"
      }`}
      key={index}>
        {/* Active tab glow effect */}
        {activeTab === tab && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-cyan-600/20 animate-pulse rounded-xl"></div>
        )}
        
        <span className="relative z-10 tracking-wide">
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </span>
        
        {/* Active tab indicator dot */}
        {activeTab === tab && (
          <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
        )}
      </button>
    ))
  }
</div>
            {/* posts */}
            {
              activeTab === 'posts' && (
                <div className='mt-6  flex flex-col items-center gap-6'>
                  {
                    posts.map((post)=>(
                      <PostCard key={post._id} post={post} />
                    ))
                  }
                </div>
              )
            }

            {/* to be remembered ************-------------**************------------ */}
            {
              activeTab === "media" && (
                <div className='flex flex-wrap mt-6 max-w-6xl'>
                  {
                    posts.filter((post)=>post.image_urls.length > 0).map((post) => (
                      <>
                      {post.image_urls.map((image, index)=>(
                        <Link
                        target='_blank'
                        to={image}
                        className='relative group'
                        key={index}>
                          <img src={image} 
                          className='w-64 aspect-video object-cover'
                          />
                          <p
                          className='absolute font-[absans] font-b bottom-0 right-0 text-sm p-1 px-3 backdrop-blur-2xl text-white opacity-0 group-hover:opacity-100 transition duration-300'
                          >Posted {moment(post.createdAt).fromNow()} </p>
                        </Link>
                      ))}
                      </>
                    ))
                  }
                </div>
              )
            }
        </div>
      </div>
      {showEdit && <ProfileEditModel setShowEdit={setShowEdit}/>}
    </section>
  ) : <Loading/>
}

export default Profile