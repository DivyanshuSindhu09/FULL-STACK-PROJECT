import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../../public/assets/assets'
import Loading from '../templates/Loading'
import Stories from '../templates/Stories'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  
  const fetchFeeds = async() => {
    setFeeds(dummyPostsData)
  }

  useEffect(()=>{
    fetchFeeds()
  },[])

  return feeds.length > 0 ? (
    <section className='h-full text-white overflow-y-auto py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>

      {/* stories and post list */}
      <div>
        <Stories/>
        <div className='p-4 space-y-6'>List of Post</div>
      </div>

      {/* right side bar */}
      <div>
        <div>
          <h2>Sponsered</h2>
        </div>
        <h2>Recent Messages</h2>
      </div>

    </section>
  ) : <Loading/>
}

export default Feed