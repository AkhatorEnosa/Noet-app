/* eslint-disable react/prop-types */
import { Tooltip } from "@mui/material";
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';

export const ShareNote = ({ text, wordCount }) => {

  // handle share note
  const handleShare = async () => {
    if (navigator.canShare) {
      try {
        await navigator.share({
          title: 'Share my note',
          text: text,
          url: window.location.href
        })
        console.log('Successfully shared');
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback: Copy to clipboard or show a toast
      alert("Web Share API not supported. Copying to clipboard instead.");
      navigator.clipboard.writeText(text);
    }
  }

  return (
    <Tooltip title="Share Note" arrow>
        <button
            type="button"
            onClick={handleShare}
            className={wordCount > 0 ? "w-10 h-10 flex justify-center items-center rounded-full top-2 right-2 px-2 py-2 border-[1px] border-[#114f60] shadow-lg text-[#114f60] hover:text-white hover:bg-[#114f60] hover:border-none transition-all duration-300": "w-0 h-0 opacity-0 flex justify-center items-center transition-all duration-200"}
        >
            <ShareRoundedIcon  sx={{ fontSize: 18 }} />
        </button>
    </Tooltip>
  );
};