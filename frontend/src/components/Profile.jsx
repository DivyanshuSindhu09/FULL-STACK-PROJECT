import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom"
import { dummyPostsData, dummyUserData } from '../../public/assets/assets'
import Loading from '../templates/Loading'
import UserProfile from '../templates/UserProfile'
import PostCard from '../templates/PostCard'
import moment from 'moment'


const Profile = () => {

  const {profileId} = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  const fetchUser = async () => {
    setUser(dummyUserData)
    setPosts(dummyPostsData)
  }

  useEffect(()=>{
    fetchUser()
  }, [])
  
  return user ? (
    <section className='relative max-h-screen font-[absans] overflow-y-scroll no-scrollbar p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* profile card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* cover photo */}
          <div className='md:h-56 lg:h-36  bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
            {
              user.cover_photo && (
                <img
                className='w-full h-full object-cover'
                src={user.cover_photo} />
              )
            }
          </div>
          {/* user info */}
          <UserProfile user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>
        {/* tabs */}
        <div className='mt-4'>
            <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
              {
                ['posts', 'media', 'likes'].map((tab, index) => (
                  <button
                  onClick={()=>setActiveTab(tab)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"}`}
                  key={index}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1) }
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
    </section>
  ) : <Loading/>
}

export default Profile