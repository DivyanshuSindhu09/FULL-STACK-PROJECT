import React, { useState } from 'react'
import toast from 'react-hot-toast'


const StoryModel = ({setModel}) => {
const storyGradients = [
  "bg-gradient-to-tr from-purple-500 to-pink-500",   // Purple to Pink Glow
  "bg-gradient-to-tr from-cyan-500 to-blue-500",     // Teal to Blue Aurora
  "bg-gradient-to-tr from-orange-500 to-red-600",    // Sunset Orange to Red
  "bg-gradient-to-tr from-emerald-500 to-lime-500",  // Emerald to Lime Burst
  "bg-gradient-to-tr from-pink-500 to-yellow-400",   // Pink to Yellow Candy
  "bg-gradient-to-tr from-indigo-600 to-purple-700"  // Indigo to Deep Purple Luxe
]

    const [mode, setMode] = useState("text")
    const [background, setBackground] = useState(storyGradients[0])
    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0]
        if(file){
            setMedia(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const changeColor = (index) => {
        setBackground(storyGradients[index])
    }

    const handleCreateStory = async () => {

    }
  return (
    <section className='w-full h-screen flex items-center justify-center flex-col fixed bg-black/50 text-white top-0 left-0 z-99 backdrop-blur '>
        <i
        onClick={()=>setModel(false)}
        className="absolute top-5 right-5 text-3xl cursor-pointer ri-close-circle-line"></i>
        <h2 className='text-4xl font-[acma-black] mb-4'>Share Your Moment!</h2>
        <div className= {`rounded-lg z-100 h-96 w-150 flex items-center justify-center relative ${background}`} >
            {
                mode === "text" && (
                    <textarea 
                    placeholder='Say it loud without saying a word...'
                    value={text}
                    onChange={(e)=>setText(e.target.value)}
                    className=' font-[absans] bg-transparent text-white w-full h-full p-6 text-xl resize-none focus:outline-none'
                    />
                )
            }
            {
                mode === "media" && previewUrl && (
                    media?.type.startsWith('image')  ? ( 
                        //! remember startsWith()
                        <img src={previewUrl} 
                        className='object-contain max-h-full'
                        />
                    ) : (
                        <video 
                        className='max-h-full object-contain'
                        src={previewUrl}/>
                    )
                )
            }

        </div>
            <div 
            className='flex mt-4 gap-2'
            >
                {
                    storyGradients.map((color,index)=>(
                        <button
                        onClick={()=>changeColor(index)}
                        key={index}
                        className={`w-6 h-6 rounded-full ring cursor-pointer ${color}`}
                        />
                    ))                    
                }
            </div>
            <div className='flex gap-2 mt-4 w-150'>
                <button 
                onClick={()=>{setMode('text'); setMedia(null); setPreviewUrl(null)}}
                className={`flex-1 flex items-center justify-center font-[absans] cursor-pointer gap-2 p-2 rounded
                ${mode === "text" ? "bg-white text-black" : "bg-zinc-800" }`}>
                    <i className="ri-quote-text text-xl"></i> <p className='font-[absans]'>Text</p>
                </button>
                <label 
                className={`flex flex-1 items-center justify-center gap-2 p-2 rounded cursor-pointer
                ${mode === "media" ? "bg-white text-black" : "bg-zinc-800" }`}>
                    <input
                    onChange={(e)=>{handleMediaUpload(e); setMode('media')}}
                    className='hidden'
                    type="file" accept='image/*, video/*' />
                    <i class="text-xl ri-file-upload-fill"></i> <p className='font-[absans]'>Photo/Video</p>
                </label>
            </div>
                <button
      onClick={()=>toast.promise(handleCreateStory(), {
        loading : "Saving...",
        success : <p className='font-[absans]'>Story Added</p>,
        error : e => <p> {e.message} </p>
      })}
      className="relative overflow-hidden flex items-center text-xl cursor-pointer font-[acma-black] px-8 py-3 mt-4 rounded-2xl font-semibold text-white tracking-wide
        bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
        shadow-[0_8px_30px_rgba(236,72,153,0.4)] hover:shadow-[0_8px_40px_rgba(236,72,153,0.6)]
        transition-all duration-300 hover:scale-105 active:scale-95"
    >
      {/* Shine sweep */}
      <span className="shine absolute inset-0 w-full h-full" />

      {/* Content */}
      <span className="inline-flex items-center gap-2 relative z-10">
        <i className="ri-sparkling-2-line text-lg"></i>
        Create Story
      </span>

      {/* Animated gradient border */}
      <span className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400
        animate-gradient bg-[length:300%_300%] opacity-50 pointer-events-none" />
    </button>
    </section>
  )
}

export default StoryModel