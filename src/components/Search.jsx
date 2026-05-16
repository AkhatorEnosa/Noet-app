/* eslint-disable react/prop-types */
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

const Search = ({ searchInput, setSearchInput, isLoading }) => {
  const handleClear = () => {
    setSearchInput('');
  };

  return (
    <div className="w-[80%] md:w-[50%] z-10 relative">
      <input 
        type="text" 
        className="w-full h-full p-3 md:p-4 pr-20 outline-none bg-transparent text-sm lg:text-base rounded-full shadow-md bg-white border-[1px] border-gray-300 focus:border-[#114f60]"
        value={searchInput}
        placeholder="Search my notes..."
        onChange={(e) => setSearchInput(e.target.value)}
      />
      
      {/* Loading spinner */}
      {isLoading && searchInput && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-[#114f60] rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Clear button */}
      {!isLoading && searchInput && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Clear search"
        >
          <ClearRoundedIcon className="text-gray-500" fontSize="small" />
        </button>
      )}
    </div>
  )
}

export default Search
