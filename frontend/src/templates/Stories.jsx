import React, { useEffect, useState } from 'react'
import { dummyStoriesData } from '../../public/assets/assets'

const Stories = () => {
    const [stories, setStories] = useState([0])

    const fetchStories = async () => {
        setStories(dummyStoriesData)
    }

    useEffect(() => {
        fetchStories()
    }, [])

  return (
    <section className='w-screen overflow-x-auto sm:w-[calc(100vw-240px)] px-4 py-2'>

        <div className='flex gap-4 pb-5'>
            {/* Add Story Card */}
            <div>
            </div>
                {/* stories */}
        </div>

    </section>
  )
}

export default Stories