import React from 'react'

const StoryViewer = ({viewStory, setViewStory}) => {
  return (
    <section 
    style={{    backgroundColor: viewStory.media_type === "text" ? viewStory.background_color : "#000000"
}}
    className={`w-full h-screen flex items-center justify-center flex-col fixed text-white top-0 left-0 z-99  `}>

      <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
        <div
        style={{width : '50'}}
        className='h-full bg-white transition-all duration-100 linear'></div>
      </div>
    
    </section>
  )
}

export default StoryViewer