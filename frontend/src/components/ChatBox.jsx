import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAuth, useUser } from "@clerk/clerk-react"
import api from '../api/axios'
import { addMessages, fetchMessages, resetMessage } from '../features/messages/messagesSlice'
import toast from "react-hot-toast"

// ✅ custom hook for auto scroll
const useAutoScroll = (dep) => {
  const ref = useRef(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }, [dep])

  return ref
}

const ChatBox = () => {
  const { messages } = useSelector((state) => state.messages)

  const { userId } = useParams()
  const { getToken } = useAuth()
  const { user: loggedInUser } = useUser()   // 👈 Clerk user
  const dispatch = useDispatch()

  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(null)

  const connections = useSelector((state) => state.connections.connections)

  const messageEndRef = useAutoScroll(messages)

  // ✅ fetch messages of current chat user
  const fetchUserMessages = async () => {
    const token = await getToken()
    try {
      dispatch(fetchMessages({ token, userId }))
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✅ send message
  const sendMessage = async () => {
    const token = await getToken()
    try {
      if (!text && !image) return

      const formData = new FormData()
      formData.append('to_user_id', userId)
      formData.append('text', text)
      image && formData.append('image', image)

      const { data } = await api.post('/api/message/send', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        setText('')
        setImage(null)
        dispatch(addMessages(data.message))
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✅ find current chat user from connections
  useEffect(() => {
    if (connections.length > 0) {
      const chatUser = connections.find(connection => connection._id === userId)
      setUser(chatUser)
    }
  }, [connections, userId])

  // ✅ fetch messages on mount and reset on unmount
  useEffect(() => {
    fetchUserMessages()
    return () => {
      dispatch(resetMessage())
    }
  }, [userId])

  return user && (
    <section className='flex font-[absans] flex-col h-screen bg-[#0F1419]'>
      {/* Header */}
      <div className='flex items-center gap-3 p-4 md:px-10 xl:pl-42 bg-[#1C2128] border-b border-gray-700/50'>
        <img   
          className='size-10 rounded-full'
          src={user.profile_picture} alt="" />
        <div>
          <p className='font-semibold text-white'>{user.full_name}</p>
          <p className='text-sm text-gray-400 -mt-0.5'>@{user.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className='p-5 md:px-10 h-full no-scrollbar overflow-y-scroll'>
        <div className='space-y-3 max-w-4xl mx-auto'>
          {messages &&
            messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => (
                <div
                  className={`flex flex-col ${message.from_user_id === loggedInUser.id ? 'items-end' : 'items-start'}`}
                  key={index}>
                  <div className={`${
                    message.from_user_id === loggedInUser.id 
                      ? "rounded-br-none bg-[#0969DA] text-white" 
                      : "rounded-bl-none bg-[#21262D] text-gray-100 border border-gray-700/50"
                  } p-3 text-sm max-w-sm rounded-lg`}>
                    
                    {/* ✅ auto scroll on image load */}
                    {message.message_type === "image" && (
                      <img
                        className='w-full max-w-sm rounded-lg mb-2'
                        src={message.media_url}
                        alt=""
                        onLoad={() => messageEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                      />
                    )}
                    
                    <p>{message.text}</p>
                  </div>
                </div>
              ))
          }

          {/* scroll target */}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Input box */}
      <div className='px-4 pb-4'>
        <div className='flex items-center gap-3 pl-4 pr-2 py-2 bg-transparent w-full max-w-xl backdrop-blur-2xl  mx-auto border border-gray-700/50 rounded-full'>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className='flex-1 outline-none text-gray-100 bg-transparent placeholder-gray-500'
            placeholder='Type a message....'
            type="text" />

          <label htmlFor="image" className='cursor-pointer p-2 hover:bg-gray-700/50 rounded-full transition-colors'>
            {image ? (
              <img
                className='h-6 rounded'
                src={URL.createObjectURL(image)}
                alt="preview"
              />
            ) : (
              <i className="text-lg ri-image-line text-gray-400"></i>
            )}
            <input
              id='image'
              accept='image/*'
              hidden
              onChange={(e) => setImage(e.target.files[0])}
              type="file" />
          </label>

          <button
            onClick={sendMessage}
            className='bg-[#0969DA] hover:bg-[#0860CA] active:scale-95 text-white p-2 rounded-full transition-colors'>
            <i className="text-lg text-white ri-send-plane-2-fill"></i>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ChatBox