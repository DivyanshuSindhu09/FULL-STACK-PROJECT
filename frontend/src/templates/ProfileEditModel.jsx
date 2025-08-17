import React, { useState } from 'react'
import { dummyUserData } from '../../public/assets/assets'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../features/user/userSlice'
import { useAuth } from "@clerk/clerk-react"
import toast from 'react-hot-toast'

const ProfileEditModel = ({setShowEdit}) => {
    
    //! const user = dummyUserData

    const user = useSelector((state) => state.user.value)

    const dispatch = useDispatch()
    const {getToken} = useAuth()

    const [editForm, setEditForm] = useState({
        username : user.username,
        bio : user.bio,
        location : user.location,
        profile_picture : null,
        cover_photo : null,
        full_name : user.full_name
    })
    //! very important
    const handleSaveProfile = async (e) => {
        e.preventDefault()

        try {

            const userData = new FormData()
            const {full_name, username, bio, location, profile_picture, cover_photo} = editForm

            userData.append('username', username)
            userData.append('bio', bio)
            userData.append('location', location)
            userData.append('full_name', full_name)

            profile_picture && userData.append('profile_picture', profile_picture)
            cover_photo && userData.append('cover_photo', cover_photo)


            const token = await getToken()
            dispatch(updateUser({userData, token}))

            setShowEdit(false)
        } catch (error) {
            toast.error(error.message)
        }
    }
  return (
    <section className='fixed no-scrollbar top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-gradient-to-br from-black/80 via-slate-900/60 to-black/80 backdrop-blur-sm'>
        <div className='max-w-2xl sm:py-6 mx-auto'>
            <div className='bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/20 p-6 border border-purple-400/30 relative overflow-hidden'>
                
                {/* Stunning background effects */}
                <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5'></div>
                <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent'></div>
                
                <div className='relative z-10'>
                    <h2 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6 drop-shadow-lg'>Edit Profile</h2>

                    <form 
                    className='space-y-6'
                    onSubmit={e => toast.promise(
                        handleSaveProfile(e),{
                            loading : "Saving...."
                        }
                    )}
                    >
                        <div className='flex flex-col items-start gap-3'>
                            <label 
                            className='block text-sm font-semibold text-gray-200 mb-1'
                            htmlFor="profile_picture">
                                Profile Picture
                                <input 
                                hidden
                                className='w-full p-3 border-2 border-gray-200 rounded-lg'
                                onChange={(e)=>setEditForm({...editForm, profile_picture : e.target.files[0]})}
                                id='profile_picture'
                                accept='image/*'
                                type="file" />
                                <div className='group/profile relative cursor-pointer'>
                                    <img
                                    className='w-24 h-24 rounded-full object-cover mt-2 border-2 border-cyan-400/50 shadow-lg'
                                    src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} alt="" />

                                    <div className='absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-purple-600/60 to-cyan-600/60 rounded-full items-center justify-center transition-all duration-300'>
                                        <i className="text-white ri-pencil-line text-lg drop-shadow-md"></i>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* cover photo */}

                        <div className='flex flex-col items-start gap-3'>
                            <label htmlFor="cover_photo" className='block text-sm font-semibold text-gray-200 mb-1 cursor-pointer'>
                                Cover Photo
                                <input 
                                hidden
                                className='w-full p-3 border-2 border-gray-200 rounded-lg'
                                onChange={(e)=>setEditForm({...editForm, cover_photo : e.target.files[0]})}
                                id='cover_photo'
                                accept='image/*'
                                type="file" />
                                <div className='group/cover relative cursor-pointer'>
                                    <img
                                    className='w-80 h-40 rounded-xl object-cover mt-2 border-2 border-purple-400/30 shadow-lg'
                                    src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_picture} alt="" />
                                    <div className='absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-purple-600/60 to-cyan-600/60 rounded-xl items-center justify-center transition-all duration-300'>
                                        <i className="text-white ri-pencil-line text-lg drop-shadow-md"></i>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* other details */}
                        <div>
                            <label
                            className='block text-sm font-semibold text-gray-200 mb-2'
                            >
                                Name
                            </label>
                            <input 
                            placeholder='Please enter your full name'
                            value={editForm.full_name}
                            onChange={(e)=>setEditForm({...editForm, full_name : e.target.value})}
                            className='w-full p-4 border border-purple-400/30 rounded-xl bg-slate-900/60 backdrop-blur-sm text-white placeholder-gray-400 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all duration-300'
                            type="text" />
                        </div>


                        <div>
                            <label
                            className='block text-sm font-semibold text-gray-200 mb-2'
                            >
                                Username
                            </label>
                            <input 
                            placeholder='Please enter your username'
                            value={editForm.username}
                            onChange={(e)=>setEditForm({...editForm, username : e.target.value})}
                            className='w-full p-4 border border-purple-400/30 rounded-xl bg-slate-900/60 backdrop-blur-sm text-white placeholder-gray-400 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all duration-300'
                            type="text" />
                        </div>

                        <div>
                            <label
                            className='block text-sm font-semibold text-gray-200 mb-2'
                            >
                                Bio
                            </label>
                            <textarea 
                            rows={3}
                            placeholder='Please enter your bio'
                            value={editForm.bio}
                            onChange={(e)=>setEditForm({...editForm, bio : e.target.value})}
                            className='w-full p-4 border border-purple-400/30 rounded-xl bg-slate-900/60 backdrop-blur-sm text-white placeholder-gray-400 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all duration-300 resize-none'
                            />
                        </div>

                        <div>
                            <label
                            className='block text-sm font-semibold text-gray-200 mb-2'
                            >
                                Location
                            </label>
                            <input 
                            placeholder='Please enter your location'
                            value={editForm.location}
                            onChange={(e)=>setEditForm({...editForm, location : e.target.value})}
                            className='w-full p-4 border border-purple-400/30 rounded-xl bg-slate-900/60 backdrop-blur-sm text-white placeholder-gray-400 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all duration-300'
                            type="text" />
                        </div>

                        {/* buttons */}
                        <div className='flex justify-end space-x-3 pt-6'>

                            <button
                            onClick={()=>setShowEdit(false)}
                            className='px-6 py-3 border border-gray-600 rounded-xl text-gray-300 hover:bg-slate-800/60 hover:text-white transition-all duration-300 backdrop-blur-sm'       
                            >
                                Cancel 
                            </button>

                            <button
                            type='submit'
                            className='px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-purple-500/25 font-semibold'
                            >
                                Save Changes 
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    </section>
  )
}

export default ProfileEditModel