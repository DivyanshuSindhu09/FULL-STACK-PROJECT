import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../../public/assets/assets'
import Loading from '../templates/Loading'
import Stories from '../templates/Stories'
import PostCard from '../templates/PostCard'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  
  const fetchFeeds = async() => {
    setFeeds(dummyPostsData)
  }

  useEffect(()=>{
    fetchFeeds()
  },[])

  return feeds.length > 0 ? (
    <section className='h-full text-white   xl:pr-5 flex items-start justify-center xl:gap-8'>

      {/* stories and post list */}
      <div className=' min-h-full w-[70%]'>
        <Stories/>
        
        <div className='p-4 max-h-[75vh] no-scrollbar overflow-hidden overflow-y-scroll  space-y-6'>
          {
            feeds.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          }
        </div>
      </div>

      {/* right side bar */}
      <div className='w-[25%]  min-h-full'>
        <div>
          <h2>Sponsered</h2>
        </div>
        <h2>Recent Messages</h2>
      </div>

      

    </section>
  ) : <Loading/>
}

export default Feed