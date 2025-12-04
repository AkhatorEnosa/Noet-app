// import Logo from '../assets/logo.webp'
import GoogleIcon from '@mui/icons-material/Google';
import { motion } from 'framer-motion'
import useLogin from '../hooks/useLogin';
import { useSelector } from 'react-redux';
import Logo from '../assets/logo.webp'

const SignIn = () => {
  const {mutate, isPending} = useLogin()
  const {isLoading} = useSelector((state) => state.data)

  const handleSignIn = () => {
    mutate()
  }

  if(isPending || isLoading) return <div className="animate-pulse py-52 w-full h-screen flex justify-center items-center">A moment please...</div>

  if (!isLoading) return (
    <div 
      className='relative w-screen h-screen flex flex-col gap-10 lg:grid lg:grid-cols-5 justify-center px-10 py-44 items-center'
    >
       <motion.div 
        initial={{y: -40}} 
        animate={{y: 0}} 
        transition={{ type: "spring", damping: 8, velocity: 2 }} 
        className='w-full col-span-3 flex flex-col gap-4 bg-white/70 rounded-xl justify-center items-center'>

        <img src={Logo} alt="website_logo" />
        {/* <h1 className='logo-signin'>wrote<b>Note</b></h1> */}
       </motion.div>

       <motion.div 
        initial={{y: 40}} 
        animate={{y: 0}} 
        transition={{ type: "spring", damping: 8, velocity: 2 }} 
        className='w-full h-fit lg:h-full flex flex-col gap-5 justify-center py-10 lg:py-20 items-center bg-white/70 rounded-xl shadow-sm px-3 col-span-2'>

         <motion.div 
           initial={{ x: -40}}
           animate={{ x: 0}}
           transition={{ type: "spring", damping: 8, velocity: 2}}
         >
           <h2 className='px-20 text-xl lg:text-3xl text-center font-semibold'>Get your <i className='text-[#114f60] font-extrabold not-italic'>thoughts</i> and <i className='text-[#114f60] font-extrabold not-italic'>ideas</i>, <i className='text-[#114f60] font-extrabold not-italic'>structured</i> and <i className='text-[#114f60] font-extrabold not-italic'>organised</i>, all in one place.</h2>
         </motion.div>

        <motion.button 
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 5px 10px rgba(0,0,0,0.1)"
          }}
          whileTap={{
            scale: 0.95,
            backgroundColor: 'rgba(0 0 0 1)'
          }}
          className='flex justify-center items-center px-4 py-2 rounded-lg gap-3 active:shadow-lg bg-[#114f60] text-white'
           onClick={handleSignIn}>
            <GoogleIcon /> 
            <p>Sign in with Google</p>
        </motion.button>
      </motion.div>
    </div>
  )
}

export default SignIn