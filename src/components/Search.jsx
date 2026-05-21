/* eslint-disable react/prop-types */
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { useTheme } from '../context/ThemeContext';

const Search = ({ searchInput, setSearchInput, isSearching }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const handleClear = () => {
    setSearchInput('');
  };

  return (
    <div className="w-[80%] md:w-[50%] z-10 relative">
      <input 
        type="text" 
        className={`w-full h-full p-3 md:p-4 pr-20 outline-none text-sm lg:text-base rounded-full shadow-md border-[1px] focus:border-[#114f60] ${isDark ? 'bg-dark-surface border-dark-border text-dark-text placeholder-dark-textMuted' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
        value={searchInput}
        placeholder="Search my notes..."
        onChange={(e) => setSearchInput(e.target.value)}
      />
      
      {/* Loading spinner */}
      {isSearching && searchInput && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className={`w-4 h-4 border-2 rounded-full animate-spin ${isDark ? 'border-dark-border border-t-[#3b82f6]' : 'border-gray-300 border-t-[#114f60]'}`}></div>
        </div>
      )}
      
      {/* Clear button */}
      {!isSearching && searchInput && (
        <button
          type="button"
          onClick={handleClear}
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full transition-colors ${isDark ? 'hover:bg-dark-border' : 'hover:bg-gray-200'}`}
          aria-label="Clear search"
        >
          <ClearRoundedIcon className={isDark ? 'text-dark-textMuted' : 'text-gray-500'} fontSize="small" />
        </button>
      )}
    </div>
  )
}

export default Search
