// verify if color option is white to change text color to black for better visibility
  export const verifyColorIsWhite = (colorOptionValue) => {
      const colorIsWhite = colorOptionValue?.includes("bg-white");
      if (colorIsWhite) return true
  }