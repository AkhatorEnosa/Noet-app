import { verifyColorIsWhite } from "./verifyColorIsWhite";

  // get text color from colorOptionValue
  export const getColor = (colorOptionValue) => {
    if (verifyColorIsWhite(colorOptionValue)) {
      return String("black");
    } else {
      if (colorOptionValue === undefined || colorOptionValue === "") {
        return String("black");
      } else {
      const textColor = colorOptionValue?.split(" ")[1];

      // remove "text-" from textColor
      const colorValue = textColor.replace("text-", "");
        
      return String(colorValue);
      }
      
    }
  }