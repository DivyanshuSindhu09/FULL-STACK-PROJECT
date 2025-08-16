import Login from './components/Login'
import { Route, Routes } from 'react-router-dom'
import Feed from './components/Feed'
import Messages from './components/Messages'
import ChatBox from './components/ChatBox'
import Connections from './components/Connections'
import Profile from './components/Profile'
import CreatePost from './components/CreatePost'
import { useUser } from '@clerk/clerk-react'
import Layout from './components/Layout'
import Discover from './components/Discover'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import {Toaster} from "react-hot-toast"
import {useDispatch} from "react-redux"
import { fetchUser } from './features/user/userSlice'
import { fetchConnections } from './features/connections/connectionSlice'

const App = () => {
  const {user} = useUser()
  console.log(user)
  //! for getting access token
  const { getToken } = useAuth()    
  
  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchData = async () => {
      if(user){
      const token = await getToken()
      console.log(token)
      dispatch(fetchUser(token))
      dispatch(fetchConnections(token))
    }
    }
    fetchData()
    //! function to get user details
  }, [user, getToken, dispatch])

  return (
    <>
    <Toaster/>
    <Routes>
      <Route path="/" element={!user ? <Login /> : <Layout/> } >
      <Route index element={<Feed/>} />
      <Route path='messages' element={<Messages />} />
      <Route path='messages/:userId' element={<ChatBox />} />
      <Route path='connections' element={<Connections />} />
      <Route path='profile' element={<Profile />} />
      <Route path='profile/:profileId' element={<Profile />} />
      <Route path='create-post' element={<CreatePost />} />
      <Route path='discover' element={<Discover />} />
      </Route>
    </Routes>
    </>
  )
}

export default App