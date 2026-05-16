import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../config/supabaseClient.config';

const initialState = {
  notes: [],
  hasMore: false,
  totalCount: 0,
  error: null,
  loadingNotes: false,
};

export const getAllNotes = createAsyncThunk('api/getAllNotes', async({ 
  id, 
  filter, 
  searchInput,
  pinned = null, // null = all, true = pinned only, false = unpinned only
  page = 0,
  limit = 12
}) => {
  try {
    if(id)  {
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
      
      if(error) return error
      if (data) return { 
        notes: data, 
        hasMore: data.length === limit,
        totalCount: count 
      };
    }
  } catch (error) {
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