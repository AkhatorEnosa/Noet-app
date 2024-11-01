import Logo from '../assets/logo.webp'
import GoogleIcon from '@mui/icons-material/Google';
import { motion } from 'framer-motion'
import useLogin from '../hooks/useLogin';
import { useSelector } from 'react-redux';

const SignIn = () => {
  const {mutate, isPending} = useLogin()
  const {isLoading} = useSelector((state) => state.data)

  const handleSignIn = () => {
    mutate()
  }

  if(isPending || isLoading) return <div className="py-52 w-full  flex justify-center items-center">A moment please...</div>

  if (!isLoading) return (
    <motion.div 
      className='w-full h-[100%] grid grid-cols-5 justify-center px-10 py-56 items-center'
      initial={{
        opacity: 0
      }}

      animate={{
        opacity: 1
      }}

      transition={{
        duration: 0.5
      }}
    >
       <div className='w-full col-span-3 flex flex-col gap-4 justify-center items-center'>
        <p>Welcome to,</p>
        <img src={Logo} alt="Logo" className='w-64'/>
       </div>
       <div className='w-full h-full flex justify-center items-center px-3 col-span-2 border-l'>
        <motion.button 
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 5px 10px rgba(0,0,0,0.1)"
          }}
          whileTap={{
            scale: 0.95,
            backgroundColor: 'rgba(0 0 0 1)'
          }}
          className='flex justify-center items-center px-4 py-2 rounded-lg gap-3 active:shadow-lg bg-blue-500 text-white'
           onClick={handleSignIn}><GoogleIcon /> <p>Sign in with Google</p></motion.button>
       </div>
    </motion.div>
  )
}

export default SignIn