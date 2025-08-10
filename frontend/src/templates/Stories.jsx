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
    <section className="max-w-full px-4 py-2">
  <div className="flex space-x-5 overflow-x-auto no-scrollbar py-5 px-3 bg-amber-800">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="w-20 h-20 bg-amber-50 flex-shrink-0"></div>
    ))}
  </div>
</section>

  )
}

export default Stories