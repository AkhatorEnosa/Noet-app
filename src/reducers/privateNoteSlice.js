import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../config/supabaseClient.config';

const initialState = {
  notes: null,
  error: null,
  loadingPrivateNotes: false,
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


const privateNoteSlice = createSlice({
  name: 'api',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotes.pending, (state) => {
        // state.notes = null;
        state.loadingPrivateNotes = true;
      })
      .addCase(getAllNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.loadingPrivateNotes = false;
      })
      .addCase(getAllNotes.rejected, (state, action) => {
        state.notes = action.error.message;
        state.loadingPrivateNotes = false;
      })
  },
});

// export const { shuffleNoets } = privateNoteSlice.actions;
export default privateNoteSlice.reducer;