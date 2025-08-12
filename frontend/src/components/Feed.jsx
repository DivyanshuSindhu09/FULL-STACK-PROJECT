import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../../public/assets/assets'
import Loading from '../templates/Loading'
import Stories from '../templates/Stories'
import PostCard from '../templates/PostCard'
import RecentMessages from '../templates/RecentMessages'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  
  const fetchFeeds = async() => {
    setFeeds(dummyPostsData)
  }

  useEffect(()=>{
    fetchFeeds()
  },[])

  return feeds.length > 0 ? (
    <section className='max-h-screen text-white overflow-hidden overflow-y-scroll no-scrollbar  xl:pr-5 flex items-start justify-center xl:gap-8'>

      {/* stories and post list */}
      <div className=' min-h-full w-[70%]'>
        <Stories/>
        
        <div className='p-4  no-scrollbar   space-y-6'>
          {
            feeds.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          }
        </div>
      </div>

      {/* right side bar */}
              <div className='w-[25%] max-xl:hidden sticky top-0 min-h-full'>
                <div className="max-w-[100%] bg-[#1e293b] text-sm font-[absans] mt-5 p-4 rounded-xl flex flex-col gap-3 shadow-lg border border-[#334155]">
          <h3 className="text-[#fbbf24] font-semibold tracking-wide">Sponsored</h3>
          
          <img
            className="w-75 rounded-lg shadow-md"
            src="/forged.jpeg"
            alt="Forged In Syntax"
          />
          
          <p className="text-gray-100 font-medium">Forged In Syntax</p>
          <p className="text-gray-400 text-xs">Join Now</p>
        </div>

        <RecentMessages/>
      </div>

      

    </section>
  ) : <Loading/>
}

export default Feed