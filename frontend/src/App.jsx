import Login from './components/Login'
import { Route, Routes, useLocation } from 'react-router-dom'
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
import { useEffect, useRef } from 'react'
import toast, { Toaster } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { fetchUser } from './features/user/userSlice'
import { fetchConnections } from './features/connections/connectionSlice'
import { addMessages } from './features/messages/messagesSlice'
import Notifications from './templates/Notifications'

const App = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const { pathname } = useLocation()
  const pathnameRef = useRef(pathname)
  const dispatch = useDispatch()

  //! initial fetch
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken()
        dispatch(fetchUser(token))
        dispatch(fetchConnections(token))
      }
    }
    fetchData()
  }, [user, getToken, dispatch])

  //! keep track of current path
  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  //! SSE connection
  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(
        import.meta.env.VITE_BASEURL + "/api/message/" + user.id
      )

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log("📡 raw SSE:", data)

          if (data.type === "connected") {
            console.log("✅ SSE connected:", data.message)
            return
          }

          if (data.type === "message") {
            const msg = data.payload
            console.log("📩 SSE new message:", msg)

            if (pathnameRef.current === "/messages/" + msg.from_user_id._id) {
              console.log("🎯 condition true hui")
              dispatch(addMessages(msg))
            } else {
              console.log("⚠️ msg for other chat")
              toast.custom((t)=>(
                <Notifications t={t} message={data.payload}/>
              ), {position : "bottom-right"})
            }
          }
        } catch (err) {
          console.error("❌ SSE parse error:", event.data, err)
        }
      }

      return () => {
        eventSource.close()
      }
    }
  }, [user, dispatch])

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="discover" element={<Discover />} />
        </Route>
      </Routes>
    </>
  )
}

export default App


// import Login from './components/Login'
// import { Route, Routes, useLocation } from 'react-router-dom'
// import Feed from './components/Feed'
// import Messages from './components/Messages'
// import ChatBox from './components/ChatBox'
// import Connections from './components/Connections'
// import Profile from './components/Profile'
// import CreatePost from './components/CreatePost'
// import { useUser } from '@clerk/clerk-react'
// import Layout from './components/Layout'
// import Discover from './components/Discover'
// import { useAuth } from '@clerk/clerk-react'
// import { useEffect, useRef } from 'react'
// import toast, {Toaster} from "react-hot-toast"
// import {useDispatch} from "react-redux"
// import { fetchUser } from './features/user/userSlice'
// import { fetchConnections } from './features/connections/connectionSlice'
// import { addMessages } from './features/messages/messagesSlice'

// const App = () => {

//   const {user} = useUser()
//   console.log(user)
//   //! for getting access token
//   const { getToken } = useAuth()    

//   //! real time wali setting
//   const {pathname} = useLocation()

//   const pathnameRef = useRef(pathname)
  
//   const dispatch = useDispatch()

//   useEffect(()=>{
//     const fetchData = async () => {
//       if(user){
//       const token = await getToken()
//       console.log(token)
//       dispatch(fetchUser(token))
//       dispatch(fetchConnections(token))
//     }
//     }
//     fetchData()
//     //! function to get user details
//   }, [user, getToken, dispatch])

//   useEffect(()=>{
//     pathnameRef.current = pathname            
//   }, [pathname])

//   useEffect(()=>{
//     if(user){
//       const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user.id)

//       eventSource.onmessage = (event) => {
//         const message = JSON.parse(event.data)
//         console.log(pathnameRef.current)
//         console.log('/messages/' + message.from_user_id)
//         if(pathnameRef.current === ('/messages/' + message.from_user_id)){
//           console.log(pathnameRef.current)
//           console.log('/messages/' + message.from_user_id)
//           console.log("condition true hui")
//           dispatch(addMessages(message))
//         }else{
//           console.log("error hora")
//         }
//       }
//       return () => {
//         eventSource.close()
//       }
//     }
//   },[user, dispatch])

//   return (
//     <>
//     <Toaster/>
//     <Routes>
//       <Route path="/" element={!user ? <Login /> : <Layout/> } >
//       <Route index element={<Feed/>} />
//       <Route path='messages' element={<Messages />} />
//       <Route path='messages/:userId' element={<ChatBox />} />
//       <Route path='connections' element={<Connections />} />
//       <Route path='profile' element={<Profile />} />
//       <Route path='profile/:profileId' element={<Profile />} />
//       <Route path='create-post' element={<CreatePost />} />
//       <Route path='discover' element={<Discover />} />
//       </Route>
//     </Routes>
//     </>
//   )
// }

// export default App