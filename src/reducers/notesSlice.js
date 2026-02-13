import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../config/supabaseClient.config';

const initialState = {
  notes: [],
  error: null,
  loadingNotes: false,
};

export const getAllNotes = createAsyncThunk('api/getAllNotes', async({ id, filter, searchInput }) => {
  try {
    if(id)  {
      const { data, error } = await supabase.
        from('notes')
        .select()
        .eq('user_id', id)
        .ilike('data_value', `%${searchInput}%`)
        .order(filter, {
          ascending: false
      });
      
      if(error) return error
      if (data) return data;
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
        // state.notes = null;
        state.loadingNotes = true;
      })
      .addCase(getAllNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.loadingNotes = false;
      })
      .addCase(getAllNotes.rejected, (state, action) => {
        state.notes = action.error.message;
        state.loadingNotes = false;
      })
  },
});

// export const { shuffleNoets } = notesSlice.actions;
export default notesSlice.reducer;