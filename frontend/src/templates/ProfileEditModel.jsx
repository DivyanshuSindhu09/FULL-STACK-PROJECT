import React, { useState } from 'react'
import { dummyUserData } from '../../public/assets/assets'

const ProfileEditModel = () => {
    const user = dummyUserData

    const [editForm, setEditForm] = useState({
        username : user.username,
        bio : user.bio,
        location : user.location,
        profile_picture : null,
        cover_photo : null,
        full_name : user.full_name
    })

    const handleSaveProfile = async (e) => {
        e.preventDefault()
    }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50'>
        <div className='max-w-2xl sm:py-6 mx-auto'>
            <div className='bg-white rounded-lg shadow p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h2>

                <form 
                className='space-y-4'
                onSubmit={handleSaveProfile}
                >
                    <div className='flex flex-col items-start gap-3'>
                        <label 
                        className='block text-sm font-medium text-gray-700 mb-1'
                        htmlFor="profile_picture">
                            Profile Picture
                            <input 
                            hidden
                            className='w-full p-3 border-2 border-gray-200 rounded-lg'
                            onChange={(e)=>setEditForm({...editForm, profile_picture : e.target.files[0]})}
                            id='profile_picture'
                            accept='image/*'
                            type="file" />
                            <div className='group/profile relative'>
                                <img
                                className='w-24 h-24 rounded-full object-cover mt-2 '
                                src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} alt="" />

                                <div className='absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center'>
                                    <i className="text-white ri-pencil-line"></i>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* cover photo */}

                    <div className='flex flex-col items-start gap-3'>
                        <label htmlFor="cover_photo">
                            Cover Photo
                            <input 
                            hidden
                            className='w-full p-3 border-2 border-gray-200 rounded-lg'
                            onChange={(e)=>setEditForm({...editForm, cover_photo : e.target.files[0]})}
                            id='cover_photo'
                            accept='image/*'
                            type="file" />
                            <div className='group/cover relative'>
                                <img
                                className='w-80 h-40 rounded-lg object-cover mt-2 '
                                src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} alt="" />
                                <div className='absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded items-center justify-center'>
                                    <i className="text-white ri-pencil-line"></i>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* other details */}
                    <div>
                        <label
                        className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Name
                        </label>
                        <input 
                        placeholder='Please enter your full name'
                        value={editForm.full_name}
                        onChange={(e)=>setEditForm({...editForm, full_name : e.target.value})}
                        className='w-full p-3 border-2 border-gray-200 rounded-lg'
                        type="text" />
                    </div>


                    <div>
                        <label
                        className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Username
                        </label>
                        <input 
                        placeholder='Please enter your username'
                        value={editForm.username}
                        onChange={(e)=>setEditForm({...editForm, username : e.target.value})}
                        className='w-full p-3 border-2 border-gray-200 rounded-lg'
                        type="text" />
                    </div>

                    <div>
                        <label
                        className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Bio
                        </label>
                        <textarea 
                        placeholder='Please enter your bio'
                        value={editForm.bio}
                        onChange={(e)=>setEditForm({...editForm, bio : e.target.value})}
                        className='w-full p-3 border-2 border-gray-200 rounded-lg'
                        type="text" />
                    </div>

                    <div>
                        <label
                        className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Location
                        </label>
                        <input 
                        placeholder='Please enter your location'
                        value={editForm.location}
                        onChange={(e)=>setEditForm({...editForm, location : e.target.value})}
                        className='w-full p-3 border-2 border-gray-200 rounded-lg'
                        type="text" />
                    </div>

                </form>
            </div>
        </div>
    </section>
  )
}

export default ProfileEditModel