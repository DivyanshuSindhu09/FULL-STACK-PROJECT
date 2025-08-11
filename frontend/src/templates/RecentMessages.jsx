import React, { useEffect, useState } from 'react'
import { dummyRecentMessagesData } from '../../public/assets/assets.jsx'
import { Link } from "react-router-dom"
import moment from 'moment'

const RecentMessages = () => {
  const [messages, setMessages] = useState([])

  const fetchMessages = () => {
    setMessages(dummyRecentMessagesData)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  return messages.length > 0 && (
    <div className='w-full font-[absans] rounded-xl bg-[#1E293B] mt-4 p-4 min-h-20 text-white text-sm shadow-lg'>
      <h3 className='font-semibold mb-4 text-white/90'>Recent Messages</h3>
      <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
        {messages.map((message, index) => (
          <Link
            to={`/messages/${message.from_user_id._id}`}
            key={index}
            className='flex px-2 items-start gap-2 py-2 rounded-lg hover:bg-white/5 transition-colors'
          >
            <img
              className='w-8 h-8 rounded-full'
              src={message.from_user_id.profile_picture}
              alt=""
            />
            <div className='w-full'>
              <div className='flex items-center justify-between'>
                <p className='font-medium text-white/90'>{message.from_user_id.full_name}</p>
                <p className='text-[10px] text-gray-400'>{moment(message.createdAt).fromNow()}</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-gray-300'>
                  {message.text ? message.text : "Media"}
                </p>
                {!message.seen && (
                  <p className='bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]'>
                    1
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecentMessages
