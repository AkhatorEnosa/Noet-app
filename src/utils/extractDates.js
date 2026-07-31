import * as chrono from 'chrono-node';

/**
 * Extracts the sentence containing a given substring from the full text.
 * @param {string} fullText - The full text to search in
 * @param {string} dateText - The date text to find the sentence for
 * @returns {string} - The sentence containing the date text
 */
export function extractSentenceContext(fullText, dateText) {
  if (!fullText || !dateText) return '';

  // Split text into sentences (handles ., !, ?, and newlines)
  const sentences = fullText.match(/[^.!?\n]+[.!?\n]*/g) || [fullText];

  // Find the sentence that contains the date text
  const contextSentence = sentences.find((sentence) =>
    sentence.toLowerCase().includes(dateText.toLowerCase())
  );

  return contextSentence ? contextSentence.trim() : '';
}

/**
 * Parses natural language date/time mentions from text.
 * Returns an array of detected date objects with their text, parsed date, end date, and sentence context.
 *
 * @param {string} text - The text to parse for dates
 * @returns {Array<{text: string, startDate: Date, endDate: Date | null, sentenceContext: string}>}
 */
export function extractDates(text) {
  if (!text || typeof text !== 'string') return [];

  const results = chrono.parse(text, undefined, { forwardDate: true });

  return results
    .filter((result) => {
      // Filter out very short matches that are likely false positives
      const text = result.text.trim();
      if (text.length < 3) return false;
      // Filter out pure number matches that aren't dates
      if (/^\d+$/.test(text)) return false;
      return true;
    })
    .map((result) => ({
      text: result.text.trim(),
      startDate: result.start.date(),
      endDate: result.end ? result.end.date() : null,
      sentenceContext: extractSentenceContext(text, result.text.trim()),
    }));
}

/**
 * Formats a Date object to Google Calendar's required format: YYYYMMDDTHHMMSSZ
 * @param {Date} date
 * @returns {string}
 */
export function formatDateForGoogleCalendar(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/**
 * Determines if a date has a time component (vs being just a date like "tomorrow")
 * @param {Date} date
 * @returns {boolean}
 */
export function hasTimeComponent(date) {
  return (
    date.getHours() !== 0 ||
    date.getMinutes() !== 0 ||
    date.getSeconds() !== 0
  );
}