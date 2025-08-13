import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../../public/assets/assets'

const ChatBox = () => {
  const messages = dummyMessagesData
  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(dummyUserData)

  const messageEndRef = useRef(null)
  //! the purpose of this is to scroll the webpage whenever we get a new message

  const sendMessage = async () => {

  }

  useEffect(()=>{
    messageEndRef.current?.scrollIntoView({behavior : "smooth"})
  },[messages])

  //! toSorted() is similar to sort() but it return a new array
  //! nums.sort((a, b) => a - b); // ascending
  //! nums.sort((a, b) => b - a); // descending

  return user && (
    <section className='flex font-[absans] flex-col h-screen'>
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
        <img   
        className='size-8 rounded-full'
        src={user.profile_picture} alt="" />
        <div>
          <p className='font-bold'> {user.full_name} </p>
          <p className='text-sm text-gray-500 -mt-1.5'> @ {user.username} </p>
        </div>
      </div>

      <div className='p-5 md:px-10 h-full no-scrollbar overflow-y-scroll'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {
            messages.toSorted((a,b)=> new Date(a.createdAt) - new Date(b.createdAt)).map((message, index)=>(
              <div 
              className={`flex flex-col  ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}
              key={index}>
                <div className={`${message.to_user_id !== user._id ? 'rounded-bl-none' : "rounded-br-none"} p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow`}>
                  {
                    message.message_type === "image" && (
                      <img
                      className='w-full max-w-sm rounded-lg mb-1'
                      src={message.media_url}
                      alt="" />
                    )
                  }
                  <p> {message.text} </p>
                </div>
              </div>
            ))
          }

          <div ref={messageEndRef} />

        </div>
      </div>

      <div className='px-4'>
          <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
            <input
            value={text}
            onChange={(e)=>setText(e.target.value)}
            onKeyDown={(e)=>e.key === "Enter" && sendMessage()}
            className='flex-1 outline-none text-slate-700'
            placeholder='Type a message....'
            type="text" />

            <label htmlFor="image">

              {
                image ? <img 
                        className='h-8 rounded'
                        src={URL.createObjectURL(image)} /> : <i className="text-xl ri-image-line"></i>
              }
              <input 
              id='image'
              accept='image/*'
              hidden
              onChange={(e)=>setImage(e.target.files[0])}
              type="file" />
            </label>

            <button 
            onClick={sendMessage}
            className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
              <i className="text-xl text-white ri-send-plane-2-fill"></i>
            </button>
          </div>
      </div>

    </section>
  )
}

export default ChatBox