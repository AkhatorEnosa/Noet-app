/**
 * Offline cache utility using localStorage.
 * Stores notes and user data so the app can function without a network connection.
 */

const NOTES_CACHE_PREFIX = 'noet_notes_';
const USER_CACHE_KEY = 'noet_cached_user';

/**
 * Check if the browser is currently online.
 * @returns {boolean}
 */
export const isOnline = () => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

/**
 * Cache notes for a specific user in localStorage.
 * @param {string} userId - The user's ID
 * @param {Array} notes - Array of note objects
 */
export const cacheNotes = (userId, notes) => {
  if (!userId || !Array.isArray(notes)) return;
  try {
    localStorage.setItem(`${NOTES_CACHE_PREFIX}${userId}`, JSON.stringify(notes));
  } catch (error) {
    console.warn('Failed to cache notes:', error);
  }
};

/**
 * Retrieve cached notes for a specific user from localStorage.
 * @param {string} userId - The user's ID
 * @returns {Array|null} Cached notes array, or null if none exist
 */
export const getCachedNotes = (userId) => {
  if (!userId) return null;
  try {
    const cached = localStorage.getItem(`${NOTES_CACHE_PREFIX}${userId}`);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Failed to read cached notes:', error);
    return null;
  }
};

/**
 * Remove cached notes for a specific user.
 * @param {string} userId - The user's ID
 */
export const clearCachedNotes = (userId) => {
  if (!userId) return;
  try {
    localStorage.removeItem(`${NOTES_CACHE_PREFIX}${userId}`);
  } catch (error) {
    console.warn('Failed to clear cached notes:', error);
  }
};

/**
 * Cache the user object so the app can render offline.
 * @param {Object} user - The user object from Supabase auth
 */
export const cacheUser = (user) => {
  if (!user) return;
  try {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  } catch (error) {
    console.warn('Failed to cache user:', error);
  }
};

/**
 * Retrieve the cached user object.
 * @returns {Object|null} Cached user object, or null if none exists
 */
export const getCachedUser = () => {
  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Failed to read cached user:', error);
    return null;
  }
};

/**
 * Remove the cached user object.
 */
export const clearCachedUser = () => {
  try {
    localStorage.removeItem(USER_CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear cached user:', error);
  }
};