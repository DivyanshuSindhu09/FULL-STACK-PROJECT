import React, { useState } from 'react'

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
        <h2 className='text-4xl font-[acma-black]'>Create A Story!</h2>
        <div className= {`rounded-lg z-100 h-96 w-80 flex items-center justify-center relative ${background}`} >
            {
                mode === "text" && (
                    <textarea 
                    placeholder='Say it loud without saying a word...'
                    value={text}
                    onChange={(e)=>setText(e.target.value)}
                    className=' font-[absans] bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none'
                    />
                )
            }
            {
                mode === "media" && previewUrl && (
                    media?.type.startWith('image')  ? ( 
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
    </section>
  )
}

export default StoryModel