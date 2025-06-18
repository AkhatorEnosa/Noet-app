/* eslint-disable react/prop-types */

import { useState } from "react";
import { Tooltip } from "@mui/material";
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

export const CopyToClipboard = ({ text, wordCount }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    // Modern API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Tooltip title={isCopied ? '✓ Copied!' : 'Copy to Clipboard'} arrow placement="top">
        <button className={wordCount > 0 ? "w-10 h-10 flex justify-center items-center rounded-full top-2 right-2 px-2 py-2 border-[1px] border-black shadow-lg hover:text-white hover:bg-green-500 hover:border-none transition-all duration-300": "w-0 h-0 opacity-0 flex justify-center items-center transition-all duration-200"} type="button" onClick={handleCopy}><ContentCopyRoundedIcon sx={{ fontSize: 18 }}/></button>
    </Tooltip>
    // <button
    //   onClick={handleCopy}
    //   style={{
    //     padding: '8px 12px',
    //     background: isCopied ? '#4CAF50' : '#f0f0f0',
    //     color: isCopied ? 'white' : 'inherit',
    //     border: 'none',
    //     borderRadius: '4px',
    //     cursor: 'pointer',
    //     transition: 'all 0.2s'
    //   }}
    // >
    //   {isCopied ? '✓ Copied!' : 'Copy to Clipboard'}
    // </button>
  );
};