import { formatDateForGoogleCalendar, hasTimeComponent } from './extractDates';

/**
 * Builds a Google Calendar Quick Add URL from a detected date and note content.
 * Opens Google Calendar's event creation page with pre-filled details.
 *
 * @param {Object} params
 * @param {string} params.text - The detected date text (e.g., "tomorrow at 3pm")
 * @param {Date} params.startDate - The parsed start date
 * @param {Date|null} params.endDate - The parsed end date (if available)
 * @param {string} params.sentenceContext - The sentence containing the detected date
 * @param {string} params.noteBody - The body/content of the note
 * @returns {string} - The Google Calendar event creation URL
 */
export function buildGoogleCalendarUrl({ text, startDate, endDate, sentenceContext, noteBody }) {
  const baseUrl = 'https://calendar.google.com/calendar/u/0/r/eventedit';

  // Build event title: use the sentence context (the full sentence containing the date)
  const eventTitle = sentenceContext?.trim() || text;

  // Build description: "Created reminder from note" + a portion of the note body
  let description = 'Created reminder from note';
  if (noteBody?.trim()) {
    const maxBodyLength = 500;
    const truncatedBody = noteBody.length > maxBodyLength
      ? noteBody.slice(0, maxBodyLength) + '...'
      : noteBody;
    description += `\n\n${truncatedBody}`;
  }

  const params = new URLSearchParams();
  params.set('text', eventTitle);
  params.set('details', description);

  // Format dates for Google Calendar
  const hasTime = hasTimeComponent(startDate);
  const startFormatted = formatDateForGoogleCalendar(startDate);

  if (endDate) {
    const endFormatted = formatDateForGoogleCalendar(endDate);
    params.set('dates', `${startFormatted}/${endFormatted}`);
  } else if (hasTime) {
    // If a time was specified but no end time, default to 1 hour later
    const defaultEnd = new Date(startDate.getTime() + 60 * 60 * 1000);
    const endFormatted = formatDateForGoogleCalendar(defaultEnd);
    params.set('dates', `${startFormatted}/${endFormatted}`);
  } else {
    // All-day event
    params.set('dates', `${startFormatted}/${startFormatted}`);
  }

  return `${baseUrl}?${params.toString()}`;
}