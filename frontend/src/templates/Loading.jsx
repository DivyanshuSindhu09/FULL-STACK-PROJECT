import React from 'react'

const Loading = ({height = '100vh'}) => {
  return (
    <section style={{height}} className='h-screen flex items-center justify-center'>
        <div className='w-10 h-10 rounded-full border-3 border-purple-500 border-t-transparent animate-spin'></div>
    </section>
  )
}

export default Loading