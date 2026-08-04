import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../config/supabaseClient.config';
import { cacheNotes, getCachedNotes, isOnline } from '../utils/offlineCache';

const initialState = {
  notes: [],
  hasMore: false,
  totalCount: 0,
  error: null,
  loadingNotes: false,
};

/**
 * Helper to filter, sort, and paginate cached notes.
 * Mirrors the Supabase query behavior for offline fallback.
 */
const processCachedNotes = (cachedNotes, { pinned, searchInput, filter, page, limit }) => {
  let filtered = cachedNotes;
  if (pinned !== null) {
    filtered = filtered.filter(note => note.pinned === pinned);
  }
  if (searchInput) {
    filtered = filtered.filter(note =>
      (note.data_value || '').toLowerCase().includes(searchInput.toLowerCase())
    );
  }
  // Sort by the filter field (descending, matching Supabase behavior)
  filtered = [...filtered].sort((a, b) => {
    const aVal = a[filter] ?? 0;
    const bVal = b[filter] ?? 0;
    if (typeof aVal === 'string') return bVal.localeCompare(aVal);
    return bVal - aVal;
  });
  // Apply pagination
  const from = page * limit;
  const to = from + limit;
  const pagedNotes = filtered.slice(from, to);
  return {
    notes: pagedNotes,
    hasMore: to < filtered.length,
    totalCount: filtered.length,
  };
};

export const getAllNotes = createAsyncThunk('api/getAllNotes', async({
  id,
  filter,
  searchInput,
  pinned = null, // null = all, pinned = true, unpinned = false
  page = 0,
  limit = 12
}) => {
  try {
    if (id) {
      // If offline, return cached notes immediately
      if (!isOnline()) {
        const cachedNotes = getCachedNotes(id);
        if (cachedNotes) {
          return processCachedNotes(cachedNotes, { pinned, searchInput, filter, page, limit });
        }
        return { notes: [], hasMore: false, totalCount: 0 };
      }

      let query = supabase
        .from('notes')
        .select('*', { count: 'exact' })
        .eq('user_id', id)
        .ilike('data_value', `%${searchInput}%`)

      // Filter by pinned status if specified
      if (pinned !== null) {
        query = query.eq('pinned', pinned)
      }

      // Apply ordering
      query = query.order(filter, {
        ascending: false
      })

      // Apply pagination
      const from = page * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        // On network error, fall back to cached notes
        const cachedNotes = getCachedNotes(id);
        if (cachedNotes) {
          return processCachedNotes(cachedNotes, { pinned, searchInput, filter, page, limit });
        }
        return error
      }
      if (data) {
        // Cache the fetched notes for offline use
        const existingCached = getCachedNotes(id) || [];
        // Merge new notes with existing cache, avoiding duplicates by id
        const merged = [...existingCached];
        for (const note of data) {
          const idx = merged.findIndex(n => n.id === note.id);
          if (idx >= 0) {
            merged[idx] = note;
          } else {
            merged.push(note);
          }
        }
        cacheNotes(id, merged);

        return {
          notes: data,
          hasMore: data.length === limit,
          totalCount: count
        };
      }
    }
  } catch (error) {
    // On any error, try to fall back to cached notes
    const cachedNotes = getCachedNotes(id);
    if (cachedNotes) {
      return processCachedNotes(cachedNotes, { pinned, searchInput, filter, page, limit });
    }
    return error
  }
})


const notesSlice = createSlice({
  name: 'api',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotes.pending, (state) => {
        state.loadingNotes = true;
      })
      .addCase(getAllNotes.fulfilled, (state, action) => {
        state.notes = action.payload.notes;
        state.hasMore = action.payload.hasMore;
        state.totalCount = action.payload.totalCount;
        state.loadingNotes = false;
      })
      .addCase(getAllNotes.rejected, (state, action) => {
        state.notes = action.error.message;
        state.loadingNotes = false;
      })
  },
});

export default notesSlice.reducer;