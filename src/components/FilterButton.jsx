/* eslint-disable react/prop-types */
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import { Tooltip } from '@mui/material';
import { useState } from 'react';

const FilterButton = ({ sortValue, setSortValue, options }) => {
    const [showSortOptions, setShowOptions] = useState(false)


  return (
    <div className="relative h-fit">
        <Tooltip title="Sort: all sorts are in descending order." arrow placement='top'>
            <button className={`relative flex justify-center items-center p-3 md:p-4 shadow-md gap-2 active:shadow-lg hover:bg-blur-600 text-white hover:bg-blue-600 ${showSortOptions ? 'bg-blue-600 border-[1px] border-gray-300' : 'bg-blue-500'} rounded-full transition-all duration-200 z-50`} onClick={() => setShowOptions(!showSortOptions)}>
                <SortRoundedIcon sx={{ fontSize: "20px" }}/>
            </button>
        </Tooltip>
        <div className={`${showSortOptions ? "z-40" : "z-0"} w-screen h-screen top-0 left-0 fixed`} onClick={()=> setShowOptions(false)}></div>
        <ul className={`${showSortOptions ? "scale-100" : "scale-0"} lg:w-52 top-16 -left-16 md:-left-0 divide-y bg-white border-[1px] border-gray-300 rounded-md shadow-md absolute text-xs transition-all duration-150 ease-in-out overflow-hidden z-50`}>
            {options.map((option) => (
                <li key={option} className={`capitalize p-3 pr-14 md:pr-24 lg:pr-0 hover:bg-blue-500/10 ${sortValue == option && 'font-extrabold bg-blue-500/10'} cursor-pointer transition-all duration-200`} onClick={() => setShowOptions(false) & setSortValue(option)}>{option}</li>
            ))}
        </ul>
    </div>
  )
}

export default FilterButton