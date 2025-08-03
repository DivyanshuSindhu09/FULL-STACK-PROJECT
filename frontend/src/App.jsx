import Login from './components/Login'
import { Route, Routes } from 'react-router-dom'
import Feed from './components/Feed'
import Messages from './components/Messages'
import ChatBox from './components/ChatBox'
import Connections from './components/Connections'
import Profile from './components/Profile'
import CreatePost from './components/CreatePost'

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} >
      <Route index element={<Feed/>} />
      <Route path='messages' element={<Messages />} />
      <Route path='messages/:userId' element={<ChatBox />} />
      <Route path='connections' element={<Connections />} />
      <Route path='profile' element={<Profile />} />
      <Route path='profile/profileId' element={<Profile />} />
      <Route path='create-post' element={<CreatePost />} />
      </Route>
    </Routes>
    </>
  )
}

export default App