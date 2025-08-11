import { SignIn, SignInButton, SignUp, SignUpButton } from "@clerk/clerk-react"

const Login = () => {
  return (
    <section className='h-screen inset-0 w-full bg-slate-900 fixed flex items-center justify-center overflow-hidden'>
    
        <div className="absolute w-72 top-20 left-10 h-72 blur-3xl opacity-30 animate-pulse transition-all rounded-full  bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 shadow-lg"></div>
        <div className="absolute w-130 h-130 blur-3xl opacity-30 top-1/3 right-10 animate-pulse transition-all rounded-full  bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 shadow-lg"></div>
        <div className="absolute w-64 h-64 bottom-20 left-1/4 blur-3xl opacity-30 animate-pulse transition-all rounded-full  bg-gradient-to-tr from-[#f12711] to-[#f5af19] shadow-lg"></div>
        <div className="absolute w-80 h-80 bottom-1/3 right-1/3 blur-3xl opacity-30 animate-pulse transition-all rounded-full  bg-gradient-to-r from-[#43cea2] to-[#185a9d]     shadow-lg"></div>

      <div className="w-[55%] z-9999 text-center h-full flex flex-col justify-center items-center">
        <h1 className="text-[7vw] leading-none font-[acma-black] text-[#f4f4f4]">
          <span className="bg-gradient-to-r font-bold text-[10vw]  z-99999999 from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent "> AXORA </span>
          <br />
          <div>
            <h2 className="mt-6"><span className="font-[acma-black] mt-4">Stay Close!</span></h2>
          </div>
        </h1>
        <p className="text-[#f4f4f4] text-xl w-[85%] mt-10 font-[absans]">
          Crafted for meaningful interactions in a world full of noise — Experience a better way to connect.
        </p>
      </div>
      <div className="flex-1  h-full justify-center items-center flex-col z-30 flex">
        <SignIn
        appearance={{
          elements: {
            card: {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              fontFamily: 'absans',
              fontSize: '20px',
            },
            footer: {
              display: 'none',
            },
          }
        }}
        
      />
      <div className="text-white text-lg mt-4 flex items-center justify-center gap-2 font-[absans]">
        <span>
          Don't have an account?
        </span>
      <SignInButton>
        <button className="px-3 ml-4 cursor-pointer py-1 bg-slate-800 rounded-xl">Sign Up</button>
      </SignInButton>
      </div>

      </div>
    </section>
  )
}

export default Login