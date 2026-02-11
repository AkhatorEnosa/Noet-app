import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../config/supabaseClient.config';

const initialState = {
  publicNotes: null,
  error: null,
  loadingPublicNote: false,
};

export const getPublicNoteViaParam = createAsyncThunk('api/getPublicNoteViaParam', async({ param }) => {
  try {
    if(param)  {
      const { data, error } = await supabase.
        from('data')
        .select()
        .eq('id', param)
        .eq('privacy', false)
      
      if(error) return error
      if (data) return data;
    }
  } catch (error) {
    return error
  }
})


const publicNoteSlice = createSlice({
  name: 'api',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getPublicNoteViaParam.pending, (state) => {
        // state.notes = null;
        state.loadingPublicNote = true;
      })
      .addCase(getPublicNoteViaParam.fulfilled, (state, action) => {
        state.publicNotes = action.payload;
        state.loadingPublicNote = false;
      })
      .addCase(getPublicNoteViaParam.rejected, (state, action) => {
        state.publicNotes = action.error.message;
        state.loadingPublicNote = false;
      })
  },
});

// export const { shuffleNoets } = publicNoteSlice.actions;
export default publicNoteSlice.reducer;