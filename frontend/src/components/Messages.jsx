import { dummyConnectionsData } from '../../public/assets/assets'
import { useNavigate } from "react-router-dom"
const Messages = () => {

  const navigate = useNavigate()

  return (
    <section className='text-white min-h-screen relative'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-[acma-black] mb-2'>Messages</h1>
          <p className='font-[absans]'>Talk to your friends and family!</p>
        </div>

        {/* connected user */}
        <div className='flex flex-col font-[absans] gap-3'>
          {dummyConnectionsData.map((user) => (
            <div 
              key={user._id} 
              className='max-w-xl flex flex-wrap gap-5 p-6 rounded-md 
                         bg-gray-100 shadow-md 
                         dark:bg-[#1E293B] dark:shadow-lg
                         transition-all duration-300 ease-out 
                         hover:scale-[1.02] hover:shadow-xl 
                         hover:dark:shadow-[0_0_20px_rgba(0,0,0,0.7)] 
                         hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]'
            >
              <img 
                src={user.profile_picture} 
                alt="" 
                className='rounded-full size-12 mx-auto' 
              />
              <div className='flex-1'>
                <p className='font-medium dark:text-white'>{user.full_name}</p>
                <p className='dark:text-gray-300'>@{user.username}</p>
                <p className='text-sm dark:text-gray-400'>{user.bio}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <button
                onClick={()=>navigate(`/messages/${user._id}`)}
                className='size-5 my-2 cursor-pointer'>
                  <i className="text-xl bg-gray-700 p-2 rounded-md ri-message-3-fill"></i>
                </button>
                <button
                onClick={()=>navigate(`/profile/${user._id}`)}
                className='size-5 my-2 cursor-pointer'>
                  <i className="text-xl bg-gray-700 p-2 rounded-md ri-eye-fill"></i>
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
