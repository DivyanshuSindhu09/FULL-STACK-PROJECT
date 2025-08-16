import { dummyConnectionsData } from '../../public/assets/assets'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const Messages = () => {
  const navigate = useNavigate()

  const {connections} = useSelector((state) => state.connections)

  return (
    <section className="text-white min-h-screen relative">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* title */}
        <div className="mb-8">
          <h1 className="text-3xl font-[acma-black] mb-2">Messages</h1>
          <p className="font-[absans] text-gray-300">Talk to your friends and family!</p>
        </div>

        {/* connected user */}
        <div className="flex flex-col font-[absans] gap-4">
          {connections.map((user) => (
            <div
              key={user._id}
              className="max-w-xl flex flex-wrap gap-5 p-6 rounded-xl
                         bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#0f172a]
                         border border-transparent
                         hover:border-cyan-400/70
                         shadow-[0_0_25px_rgba(0,0,0,0.4)]
                         hover:shadow-[0_0_35px_rgba(34,211,238,0.8)]
                         backdrop-blur-md
                         transition-all duration-300 ease-out 
                         "
            >
              {/* profile pic */}
              <img
                src={user.profile_picture}
                alt=""
                className="rounded-full size-12 mx-auto 
                           ring-2 ring-cyan-400/80 
                           hover:ring-pink-500/80 
                           shadow-[0_0_15px_rgba(34,211,238,0.6)]
                           hover:shadow-[0_0_15px_rgba(236,72,153,0.7)]
                           transition-all duration-300"
              />

              {/* user info */}
              <div className="flex-1">
                <p className="font-medium text-white">{user.full_name}</p>
                <p className="text-cyan-300">@{user.username}</p>
                <p className="text-sm text-gray-400">{user.bio}</p>
              </div>

              {/* action buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="p-2 rounded-md bg-cyan-500/90 hover:bg-cyan-400
                             shadow-[0_0_12px_rgba(34,211,238,0.8)]
                             hover:shadow-[0_0_20px_rgba(34,211,238,1)]
                             transition-all duration-300 active:scale-95"
                >
                  <i className="text-xl text-white ri-message-3-fill"></i>
                </button>
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="p-2 rounded-md bg-pink-500/90 hover:bg-pink-400
                             shadow-[0_0_12px_rgba(236,72,153,0.8)]
                             hover:shadow-[0_0_20px_rgba(236,72,153,1)]
                             transition-all duration-300 active:scale-95"
                >
                  <i className="text-xl text-white ri-eye-fill"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Messages
