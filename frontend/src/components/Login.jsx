import React from 'react'

const Login = () => {
  return (
    <div className='h-screen inset-0 w-full bg-slate-900 fixed '>
    
        <div class="absolute w-72 top-20 left-10 h-72 blur-3xl opacity-30 animate-pulse transition-all rounded-full  bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 shadow-lg"></div>
        <div class="absolute w-96 h-96 blur-3xl opacity-30 top-1/3 right-10 animate-pulse transition-all rounded-full  bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 shadow-lg"></div>
        <div class="absolute w-64 h-64 bottom-20 left-1/4 blur-3xl opacity-30 animate-pulse transition-all rounded-full  bg-gradient-to-tr from-[#f12711] to-[#f5af19] shadow-lg"></div>
        <div class="absolute w-80 h-80 bottom-1/3 right-1/3 blur-3xl opacity-30 animate-pulse transition-all rounded-full  bg-gradient-to-r from-[#43cea2] to-[#185a9d]     shadow-lg"></div>
    </div>
  )
}

export default Login