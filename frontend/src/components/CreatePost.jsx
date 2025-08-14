import React, { useState } from 'react'
import { dummyUserData } from '../../public/assets/assets'
import toast from "react-hot-toast"
import { useSelector } from 'react-redux'

const CreatePost = () => {
  const [content, setContent] = useState("")
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  //! const user = dummyUserData replacing with store data 

  const user = useSelector((state)=>state.user.value)

  const handleSubmit = async () => {

  }

  return (
    <section className='min-h-screen font-[absans] text-white'>
    <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
            <h1 className='text-3xl font-bold mb-2 font-[acma-black]'>Create Post</h1>
            <p className='font-[absans]'>Share your thoughts with the world</p>
        </div>

        {/* Form */}
        <div className='max-w-xl bg-slate-700 p-4 sm:p-6 sm:pb-3 rounded-xl shadow-md space-y-4'>
            {/* Header */}
            <div className='flex items-center gap-3'>
                <img src={user.profile_picture} alt="" className='w-12 h-12 rounded-full shadow'/>
                <div>
                  <h2 className=''> {user.full_name} </h2>
                  <p> {user.username} </p>
                </div>
            </div>
            {/* text area */}
            <textarea 
            onChange={(e)=>setContent(e.target.value)}
            value={content}
            placeholder="What's Happening?"
            className='w-full resize-none max-h-20 font-[absans] mt-4 text-sm outline-none placeholder-gray-400' 
            />

            {/* images */}
            {
              images.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-4'>
                  {
                    images.map((image, index)=>(
                      <div 
                      key={index}
                      className='relative group'
                      >
                        <img
                        className='h-20 rounded-md' 
                        src={URL.createObjectURL(image)}/>
                        <div
                        onClick={()=>setImages(images.filter((_, i)=>(i !== index)))}
                        className='absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer'
                        >
                          <i className="font-bold text-xl text-white ri-close-fill"></i>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )
            }

            {/* bottom bar */}

            <div className='flex items-center justify-between pt-3 border-t-2 border-gray-300'>
              <label 
              className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'
              htmlFor="images">
                <i className="text-xl text-white ri-image-2-fill"></i>
              </label>

              <input 
              onChange={(e)=>setImages([...images, ...e.target.files])}
              id='images'
              accept='image/*'
              hidden
              multiple
              type="file" />

              <button 
              disabled = {loading}
              onClick={()=>toast.promise(
                handleSubmit(),
                {
                  loading : 'uploading....',
                  success : <p className='font-[absans]'>Post Added</p>,
                  error : <p className='font-[absans]'>Post Not Added</p>
                }
              )}
              className='text-sm font-[absans] bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer'>
                Publish Post
              </button>

            </div>

        </div>
    </div>
</section>
  )
}

export default CreatePost