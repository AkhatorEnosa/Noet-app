import { useSelector } from "react-redux"
import Logo from '../assets/logo.webp'

const Navbar = () => {
  const { isLoading } = useSelector(state => (state.data))
  return (
    <div className="nav w-full flex justify-between items-center px-3 md:px-20 py-5 shadow-md z-50 bg-white">
      <img src={Logo} alt="Logo" className="w-20"/>

        {isLoading && <div className="flex gap-2">
          <span className="loading loading-spinner loading-sm"></span>
          <p>Loading...</p>
        </div>}
    </div>
  )
}

export default Navbar