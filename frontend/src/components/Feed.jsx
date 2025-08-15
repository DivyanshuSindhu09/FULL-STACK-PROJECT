import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../../public/assets/assets'
import Loading from '../templates/Loading'
import Stories from '../templates/Stories'
import PostCard from '../templates/PostCard'
import RecentMessages from '../templates/RecentMessages'
import { useAuth } from "@clerk/clerk-react"
import api from '../api/axios'
import toast from 'react-hot-toast'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(false)

  const {getToken} = useAuth()

  const fetchFeeds = async () => {
    const token = await getToken()

    try {

      setLoading(true)

    const {data} = await api.get('/api/post/feed', {
      headers : {
        Authorization : `Bearer ${token}`
      }
    })

    if(data.success){
      setFeeds(data.posts)
    }else{
      toast.error(data.message)
    }
      
    } catch (error) {
      toast.error(error.message)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchFeeds()
  }, [])

  return feeds.length > 0 ? (
    <section className="max-h-screen text-white overflow-hidden overflow-y-scroll no-scrollbar xl:pr-5 flex items-start justify-center xl:gap-8 bg-[#0f172a]">
      
      {/* Stories + Post list */}
      <div className="min-h-full w-[70%] space-y-4">
        <div className="px-4 pt-4">
          <Stories />
        </div>

        <div className="p-4 no-scrollbar space-y-6">
          {feeds.map((post) => (
            <div 
              key={post._id}
              className="transition-transform duration-200 hover:scale-[1.01]"
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[25%] max-xl:hidden sticky top-0 min-h-full space-y-6 pt-4">
        
        {/* Sponsored Card */}
        <div className="bg-[#1e293b] text-sm font-[absans] p-4 rounded-xl flex flex-col gap-3 shadow-lg border border-[#334155] hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all duration-300">
          <h3 className="text-[#fbbf24] font-semibold tracking-wide">Sponsored</h3>

          <img
            className="w-full rounded-lg shadow-md object-cover"
            src="/forged.jpeg"
            alt="Forged In Syntax"
          />

          <p className="text-gray-100 font-medium">Forged In Syntax</p>
          <p className="text-gray-400 text-xs">Join Now</p>
        </div>

        {/* Recent Messages */}
        <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155]">
          <RecentMessages />
        </div>
      </div>

    </section>
  ) : (
    <Loading />
  )
}

export default Feed
