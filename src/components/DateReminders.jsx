/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Tooltip } from '@mui/material';
import { extractDates } from '../utils/extractDates';
import { buildGoogleCalendarUrl } from '../utils/googleCalendarUrl';
import { toast } from 'react-toastify';
import { getColor } from '../utils/getColor';

const DateReminders = ({ noteTitle, noteBody, color }) => {
  const [detectedDates, setDetectedDates] = useState([]);
  const [dismissedDates, setDismissedDates] = useState(new Set());

  // Re-parse dates whenever note content changes
  useEffect(() => {
    const combinedText = [noteTitle, noteBody].filter(Boolean).join('\n');
    const dates = extractDates(combinedText);
    setDetectedDates(dates);
  }, [noteTitle, noteBody]);

  const handleAddToCalendar = useCallback((dateObj) => {
    const url = buildGoogleCalendarUrl({
      text: dateObj.text,
      startDate: dateObj.startDate,
      endDate: dateObj.endDate,
      sentenceContext: dateObj.sentenceContext,
      noteBody,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success('📅 Google Calendar opened with pre-filled event!', {
      className: 'text-xs w-fit',
    });
  }, [noteBody]);

  const handleDismiss = useCallback((index) => {
    setDismissedDates((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  }, []);

  if (detectedDates.length === 0) return null;

  const visibleDates = detectedDates.filter((_, index) => !dismissedDates.has(index));
  if (visibleDates.length === 0) return null;

  return (
    <div className="w-full px-4 md:px-8 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Detected Dates
        </span>
        <div className="flex flex-wrap gap-2">
          {visibleDates.map((dateObj, index) => (
            <Tooltip
              key={index}
              title={dateObj.sentenceContext || dateObj.text}
              arrow
              placement="top"
            >
              <div className={`group flex items-center gap-1 px-2 py-1 rounded-full bg-${getColor(color)}/10 border border-${getColor(color)}/20 dark:border-${getColor(color)}/30 text-xs transition-all duration-150 hover:bg-${getColor(color)}/20 dark:hover:bg-${getColor(color)}/30`}>
                <span className={`text-${getColor(color)} truncate max-w-[150px] sm:max-w-[200px]`}>
                  {dateObj.text}
                </span>
                <Tooltip title="Add to Google Calendar" arrow placement="top">
                  <button
                    type="button"
                    onClick={() => handleAddToCalendar(dateObj)}
                    className={`w-5 h-5 flex items-center justify-center rounded-full text-${getColor(color)} hover:bg-black/50 hover:text-white transition-all duration-150`}
                  >
                    <CalendarMonthRoundedIcon sx={{ fontSize: 14 }} />
                  </button>
                </Tooltip>
                <Tooltip title="Dismiss" arrow placement="top">
                  <button
                    type="button"
                    onClick={() => handleDismiss(index)}
                    className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150"
                  >
                    <CloseRoundedIcon sx={{ fontSize: 12 }} />
                  </button>
                </Tooltip>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateReminders;