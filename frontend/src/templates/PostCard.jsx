import moment from 'moment'
import React, { useState } from 'react'
import { dummyUserData } from '../../public/assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PostCard = ({ post }) => {
  const navigate = useNavigate()
  const [likes, setLikes] = useState(post.likes_count)


  //! const currentUser = dummyUserData

  const currentUser = useSelector((state)=>state.user.value)

  const handleLike = async () => {
    // like toggle logic
  }

  // Hashtag highlight for dark theme
  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    '<span class="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-semibold">$1</span>'
  )

  return (
    <div className="bg-gradient-to-br w-full from-[#1c1f26] to-[#13151a] text-gray-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.6)] transition-all duration-300 border border-gray-800/60 p-4 space-y-4">
      {/* user info */}
      <div className="flex items-center gap-3">
        <img
          className="w-11 h-11 rounded-full shadow-md shadow-black/40 border border-gray-700"
          src={post.user.profile_picture}
          alt=""
        />
        <div>
          <span
          onClick={()=>navigate(`/profile/${post.user._id}`)}
          className="flex cursor-pointer items-center gap-2 text-[15px] font-bold font-[absans]">
            {post.user.full_name}
          </span>
          <span className="flex items-center gap-2 text-sm font-[absans] text-gray-400">
            {post.user.username} <i className="text-[5px] ri-circle-fill"></i>{' '}
            {moment(post.createdAt).fromNow()}
          </span>
        </div>
      </div>

      {/* content */}
      {post.content && (
        <div
          className="text-gray-300 font-[absans] text-[15px] whitespace-pre-line leading-relaxed"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      {/* image grid */}
      {post.image_urls?.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.image_urls.map((img, index) => (
            <img
              key={index}
              className={`w-full h-48 object-cover rounded-lg border border-gray-700/50 hover:scale-[1.02] transition-transform duration-300 ${
                post.image_urls.length === 1 && 'col-span-2 h-auto'
              }`}
              src={img}
              alt=""
            />
          ))}
        </div>
      )}

      {/* action buttons */}
      <div className="flex items-center gap-6 font-[absans] font-semibold text-gray-400 text-sm pt-3 border-t border-gray-700/60">
        {/* Like */}
        <div className="flex items-center gap-1 group">
          <i
            onClick={handleLike}
            className={`text-lg cursor-pointer ri-heart-3-fill transition-colors duration-300 group-hover:scale-110 ${
              likes.includes(currentUser._id) ? 'text-red-500' : 'group-hover:text-red-400'
            }`}
          ></i>
          <span>{likes.length}</span>
        </div>

        {/* Comment */}
        <div className="flex items-center gap-1 group">
          <i
            className="text-lg cursor-pointer ri-question-answer-line group-hover:text-indigo-400 transition-colors duration-300 group-hover:scale-110"
          ></i>
          <span>69</span>
        </div>

        {/* Share */}
        <div className="flex items-center gap-1 group">
          <i
            className="text-lg ri-share-box-fill cursor-pointer group-hover:text-green-400 transition-colors duration-300 group-hover:scale-110"
          ></i>
          <span>12</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard
