/* eslint-disable react/prop-types */

const Search = ({ searchInput, setSearchInput }) => {
  return (
    <div className="w-[50%] p-4 rounded-full shadow-md bg-white border-[1px] border-gray-300 z-10">
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