/* eslint-disable react/prop-types */
import { Tooltip } from "@mui/material";
import { THEMES } from "../constants/theme";

const ColorPallete = ({ show, colorOption, addBackground }) => {

  return (
    <div className={`absolute flex items-center justify-center bottom-[60px] ${show ? "scale-100 z-50" : "scale-0 translate-y-10 z-0"} transition-all duration-150 gap-3`}>
      {THEMES.map((theme, index) => {
        // Updated comparison logic
        const isActive = colorOption === theme.color;

        return (
          <Tooltip key={index} title={theme.name} placement="top" arrow>
            <div
              onClick={() => addBackground(theme.color)}
              className={`w-8 h-8 flex justify-center items-center ${theme.color} ${isActive ? "scale-125 border-2" : ""} hover:scale-125 transition-all duration-150 rounded-full border-[1px] border-black cursor-pointer overflow-hidden`}
            >
              {/* Render the MUI Icon component directly */}
              <div className="flex items-center justify-center scale-75">
                {theme.icon}
              </div>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ColorPallete;