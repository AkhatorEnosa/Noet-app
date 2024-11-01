import { useSelector } from "react-redux"
import Logo from '../assets/logo.webp'
import useSignOut from "../hooks/useSignOut"
import {motion} from "framer-motion"

const Navbar = () => {
  const { user, isLoading } = useSelector(state => (state.data))
  const {mutate} = useSignOut()

  const handleSignOut = async() => {
      mutate()
  }
    return (
      <div className="nav w-full flex justify-between items-center px-3 md:px-20 py-3 md:py-5 shadow-md z-50 bg-white text-sm">
        <img src={Logo} alt="Logo" className="w-14 md:w-20"/>

        <div className="flex gap-3">
          {user !== null && 
          <div className="flex justify-center items-center gap-5">
            <div className="flex gap-2 justify-center items-center bg-gray-200 pl-2 pr-5 py-2 rounded-full">
              <img src={user.identities[0].identity_data.avatar_url} alt="" className="w-8 h-8 rounded-full border-black border-[1px]"/>
              <p>{user.identities[0].identity_data.name}</p>
            </div>
            <motion.button
              whileHover={{
                color: '#000',
                boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
                borderRadius: 0
              }}
              whileTap={{
                scale: 0.95,
                backgroundColor: 'rgba(0 0 0 1)'
              }}
            className="underline text-blue-500" onClick={handleSignOut} disabled={isLoading}>
          {isLoading ? 
          <div className="flex gap-2">
            <span className="loading loading-spinner loading-sm"></span>
          </div> : "Sign Out"}</motion.button>
          </div>}
        </div>
      </div>
    )
}

export default Navbar