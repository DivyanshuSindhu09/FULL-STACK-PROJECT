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
    <section className='flex font-[absans] flex-col h-screen bg-gray-900 text-gray-100'>
      {/* Header */}
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gray-800 border-b border-gray-700'>
        <img   
          className='size-8 rounded-full'
          src={user.profile_picture} alt="" />
        <div>
          <p className='font-bold text-white'>{user.full_name}</p>
          <p className='text-sm text-gray-400 -mt-1.5'>@{user.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className='p-5 md:px-10 h-full no-scrollbar overflow-y-scroll'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {messages &&
            messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => (
                <div
                  className={`flex flex-col ${message.from_user_id === loggedInUser.id ? 'items-end' : 'items-start'}`}
                  key={index}>
                  <div className={`${message.from_user_id === loggedInUser.id ? "rounded-br-none bg-indigo-700 text-white" : "rounded-bl-none bg-gray-800 text-gray-100"} p-2 text-sm max-w-sm rounded-lg shadow`}>
                    
                    {/* ✅ auto scroll on image load */}
                    {message.message_type === "image" && (
                      <img
                        className='w-full max-w-sm rounded-lg mb-1'
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
      <div className='px-4'>
        <div className='flex items-center gap-3 pl-5 p-1.5 bg-gray-800 w-full max-w-xl mx-auto border border-gray-700 shadow rounded-full mb-5'>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className='flex-1 outline-none text-gray-100 bg-transparent placeholder-gray-500'
            placeholder='Type a message....'
            type="text" />

          <label htmlFor="image">
            {image ? (
              <img
                className='h-8 rounded'
                src={URL.createObjectURL(image)}
                alt="preview"
              />
            ) : (
              <i className="text-xl ri-image-line text-gray-400 hover:text-indigo-400"></i>
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
            className='bg-indigo-600 hover:bg-indigo-700 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
            <i className="text-xl text-white ri-send-plane-2-fill"></i>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ChatBox
