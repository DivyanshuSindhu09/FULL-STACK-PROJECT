import React, { useEffect, useState } from 'react'

const StoryViewer = ({viewStory, setViewStory}) => {


  const [progress, setProgress] = useState(0)

    useEffect(()=>{

      let timer, progressInterval;

      if(viewStory && viewStory.media_type !== 'video' ){
        setProgress(0)

        const duration = 10000;
        const setTime = 100;
        let elapsed = 0;

        progressInterval = setInterval(() => {
          elapsed += setTime
          setProgress((elapsed/duration) * 100)
        }, setTime);

        //! close story after 10 seconds

        timer = setTimeout(() => {
          setViewStory(null)
        }, duration);
      }

      return () => {
        clearTimeout(timer)
        clearInterval(progressInterval)
      }

    },[viewStory, setViewStory])

  const renderContent = () => {

  if(!viewStory) return null

    switch (viewStory.media_type) {
      case 'image':
        return (
          <img
          className='max-w-full max-h-screen'
          src={viewStory.media_url} alt="" />
        );
      case 'video':
        return (
          <video
          controls
          autoPlay
          onEnded={()=>setViewStory(null)}
          className=' max-h-screen'
          src={viewStory.media_url ? viewStory.media_url : null }  />
        );
      case 'text':
        return (
          <div className='w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center font-[absans]'> {viewStory.content} </div>
        );
    
      default:
        return null;
    }
  }

  return (

    <section 
    style={{    backgroundColor: viewStory.media_type === "text" ? viewStory.background_color : "#000000"
}}
    className={`w-full h-screen flex items-center justify-center flex-col fixed text-white top-0 left-0 z-99  `}>

      <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
        <div
        style={{width : `${progress}%` }}
        className='h-full bg-white transition-all duration-100 linear'></div>
      </div>
      <span 
      onClick={()=>setViewStory(null)}
      className='absolute top-5 z-999 cursor-pointer right-5'> <i className="text-3xl font-semibold ri-close-circle-line"></i> </span>

      {/* user info */}
      <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 
      backdrop-blur-2xl rounded bg-black/50
      '>
        <img 
        className='size-7 sm:size-8 rounded-full object-cover border-2 border-white'
        src={viewStory.user?.profile_picture} alt="" />
        <span className='font-[absans] text-lg'> {viewStory.user?.full_name} <i className="ri-checkbox-circle-fill text-xl font-bold"></i> </span>
      </div>

      <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
        {renderContent()}
      </div>
    
    </section>
  )
}

export default StoryViewer