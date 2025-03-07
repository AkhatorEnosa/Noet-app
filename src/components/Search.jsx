/* eslint-disable react/prop-types */

const Search = ({ searchInput, setSearchInput }) => {
  return (
    <div className="w-full p-4 rounded-full shadow-md bg-white border-[1px] border-gray-300">
        <input type="text" 
            className="w-full h-full outline-none bg-transparent"
            value={searchInput}
            placeholder="Search for mynoet"
            onChange={(e) => setSearchInput(e.target.value)}
        />
    </div>
  )
}

export default Search