import React, { useEffect, useState } from 'react'
import { dummyConnectionsData } from '../../public/assets/assets'
import UserCard from '../templates/UserCard'
import Loading from '../templates/Loading'
import api from '../api/axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../features/user/userSlice'

const Discover = () => {

  const dispatch = useDispatch()

  const [input, setInput] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const {getToken} = useAuth()

  const handleSearch = async (e) => {
    const token = await getToken()
    if(e.key === 'Enter'){
      try {
        setUsers([])
        setLoading(true)
        const {data} = await api.post('api/user/discover', {input},{
          headers : {
            Authorization : `Bearer ${token}`
          }
        })
        data.success ? setUsers(data.users) : toast.error(data.message)
        setLoading(false)
        setInput('')
      } catch (error) {
        toast.error(error.message)
      }
      setLoading(false)
    }
  }

  useEffect(()=>{
    getToken().then((token) => {
      dispatch(fetchUser(token))
    })
  }, [])
 
  return (
    <section className='min-h-screen text-white bg-gradient-to-b from-[#0a0118] to-[#1a103f]'>
      <div className='max-w-6xl mx-auto p-6'>

        <div className='mb-8'>
          <h1 className='text-3xl font-[acma-black] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400'>
            Discover People
          </h1>
          <p className='font-[absans] text-purple-200'>
            Connect with amazing people and grow your network!
          </p>
        </div>

        {/* search */}
        <div className='mb-8 shadow-lg shadow-purple-900/30 rounded-md border border-purple-500/30 bg-slate-900/70 backdrop-blur'>
          <div className='p-6'>
            <div className='relative'>
              <i className="text-2xl absolute left-3 top-1/2 transform -translate-y-1/2 ri-search-line text-purple-300"></i>
              <input
                //! important event
                onKeyUp={handleSearch}
                placeholder='Search people by name, username, bio, or location...'
                onChange={(e)=>setInput(e.target.value)}
                value={input}
                className='pl-10 sm:pl-12 py-2 w-full border border-purple-500/20 rounded-md max-sm:text-sm font-[absans] bg-slate-800/60 text-white placeholder-purple-300/70 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500 outline-none'
                type="text" 
              />
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-6'>
          {
            users.map((user)=>(
              <UserCard user={user} key={user._id} />
            ))
          }
        </div>

        {
          loading && <Loading height='60vh'/>
        }

      </div>
    </section>
  )
}

export default Discover
