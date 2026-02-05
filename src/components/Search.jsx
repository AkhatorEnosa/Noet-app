/* eslint-disable react/prop-types */

const Search = ({ searchInput, setSearchInput }) => {
  return (
    <div className="w-[80%] md:w-[50%] z-10">
        <input type="text" 
            className="w-full h-full p-3 md:p-4 outline-none bg-transparent text-sm lg:text-base rounded-full shadow-md bg-white border-[1px] border-gray-300 focus:border-[#114f60]"
            value={searchInput}
            placeholder="Search my notes..."
            onChange={(e) => setSearchInput(e.target.value)}
        />
    </div>
  )
}

export default Search
