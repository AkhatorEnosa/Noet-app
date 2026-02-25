/* eslint-disable react/prop-types */
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import { Tooltip } from '@mui/material';

const FilterButton = ({ sortValue, setSortValue, options, showSortOptions, setShowOptions }) => {


  return (
    <div className="relative">
        <Tooltip title="Sort: all sorts are in descending order." arrow placement='top'>
            <button className={`relative flex justify-center items-center p-3 md:p-4 shadow-md gap-2 active:shadow-lg hover:bg-blur-600 text-white  ${showSortOptions ? 'bg-[#114f60] border-[1px] border-gray-300' : 'bg-[#255f6f] hover:bg-[#114f60]'} rounded-full transition-all duration-150 z-[60]`} onClick={() => setShowOptions(!showSortOptions)}>
                <SortRoundedIcon sx={{ fontSize: "20px" }}/>
            </button>
        </Tooltip>
        <div className={`${showSortOptions ? "z-[60]" : "z-0"} w-screen h-screen top-0 left-0 fixed`} onClick={()=> setShowOptions(false)}></div>
        <div className={`${showSortOptions ? "scale-100" : "scale-0"} lg:w-52 top-16 left-0 bg-white border-[1px] border-gray-300 rounded-md shadow-md absolute text-xs transition-all duration-150 ease-in-out overflow-hidden z-[62]`}>
            <ul className='divide-y'>
                {options.map((option) => (
                    <li key={option} className={`capitalize p-2 pr-14 md:pr-24 lg:pr-0 ${sortValue == option ? 'font-extrabold bg-[#114f60] text-white ' : 'hover:bg-gray-100'} cursor-pointer transition-all duration-150`} onClick={() => setShowOptions(false) & setSortValue(option)}>{option}</li>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default FilterButton