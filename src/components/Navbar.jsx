import { useSelector } from "react-redux"

const Navbar = () => {
  const { isLoading } = useSelector(state => (state.data))
  return (
    <div className="w-full flex justify-between items-center px-20 py-5 shadow-md">
        <h1>Note App</h1>

        {isLoading && <div className="flex gap-2">
          <span className="loading loading-spinner loading-sm"></span>
          <p>Loading...</p>
        </div>}
    </div>
  )
}

export default Navbar