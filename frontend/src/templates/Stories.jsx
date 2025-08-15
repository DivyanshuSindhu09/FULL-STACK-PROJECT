import React, { useEffect, useState } from 'react'
import { dummyStoriesData } from '../../public/assets/assets'
import moment from "moment"
import StoryModel from './StoryModel'
import StoryViewer from './StoryViewer'
import {useAuth} from "@clerk/clerk-react"
import api from '../api/axios'
import toast from 'react-hot-toast'

const Stories = () => {

    const {getToken} = useAuth()
    const [stories, setStories] = useState([])
    const [model, setModel] = useState(false)
    const [viewStory, setViewStory] = useState(null)

    const fetchStories = async () => {
        try {
            const token = await getToken()

            const {data} = await api.get('/api/story/get', {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })

            if(data.success){
                setStories(data.friendsStories)
            }else{
                toast(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchStories()
    }, [])

    return (
        <section className="max-w-full px-4 ">
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-5 px-3">
                
                {/* Add Story Card */}
                <div
                onClick={()=> setModel(true)}
                className='min-w-23 rounded-lg h-30 cursor-pointer bg-gradient-to-br from-[#1e293b] to-[#334155] flex flex-col justify-center items-center border-dashed border-2 border-gray-400/40 py-5 px-1 text-sm font-[absans] shadow-lg shadow-purple-800/30 hover:shadow-purple-500/40 transition duration-300'>
                    <i className="text-xl ri-add-circle-line"></i>
                    <p>Add Story</p>
                </div>

                {/* Story Cards */}
                {
                    stories.map((story, index) => (
                        <div
                            onClick={()=>setViewStory(story)}
                            className='min-w-23 rounded-lg relative cursor-pointer h-30 bg-gradient-to-br from-[#1e293b] to-[#334155] shadow-lg shadow-purple-800/30 hover:shadow-purple-500/40 transition duration-300 py-5 px-2 text-sm font-[absans]'
                            key={index}
                        >
                            <img
                            src={story.user?.profile_picture ? story?.user.profile_picture : null}
                            className='z-1 absolute size-6 rounded-full top-2 left-2 ring-2 ring-purple-400 ring-offset-2 ring-offset-[#1e293b] shadow'
                            alt=""
                            />

                            <p className='z-1 absolute truncate top-15 left-3 text-sm max-w-18'>
                                 {/* //! truncate propcss */}
                                {story.content}
                            </p>
                            <p className='z-1 absolute bottom-1 right-1 text-xs'>
                                {moment(story.createdAt).fromNow()}
                            </p>

                            {
                                story.media_type !== "text" && (
                                    <div className='absolute inset-0 z-0 overflow-hidden rounded-lg'>
                                        {
                                            story.media_type === "image" ?
                                                <img
                                                    className='h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80'
                                                    src={story.media_url} alt=""
                                                /> :
                                                <video
                                                    className='h-full w-full  object-cover hover:scale-110 transition duration-500  opacity-70 hover:opacity-80'
                                                    src={story.media_url} 
                                                />
                                        }
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>
            {model && <StoryModel setModel={setModel} />}
            {/* view story */}
            {
                viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
            }
        </section>
    )
}

export default Stories
