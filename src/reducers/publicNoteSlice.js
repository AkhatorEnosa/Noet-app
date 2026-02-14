import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../config/supabaseClient.config';

const initialState = {
  publicNotes: null,
  collaboration: false,
  error: null,
  loadingPublicNote: false,
};

// get public note based on param that is not for user
export const getPublicNoteViaParam = createAsyncThunk('api/getPublicNoteViaParam', async({ param }) => {
  try {
    if(param)  {
      const { data, error } = await supabase.
        from('notes')
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

// Check if a collaboration already exists (Query)
export const checkCollabStatus = createAsyncThunk('api/checkCollabStatus', async ({ userId, noteId }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('collaborations')
        .select('*')
        .eq('user_requesting', userId)
        .eq('note_id', noteId)
        .maybeSingle();

      if (error) throw error;
      return data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


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
      .addCase(checkCollabStatus.pending, (state) => {
        // state.notes = null;
        state.loadingPublicNote = true;
      })
      .addCase(checkCollabStatus.fulfilled, (state, action) => {
        state.collaboration = action.payload;
        state.loadingPublicNote = false;
      })
      .addCase(checkCollabStatus.rejected, (state, action) => {
        state.collaboration = action.error.message;
        state.loadingPublicNote = false;
      })
  },
});

// export const { shuffleNoets } = publicNoteSlice.actions;
export default publicNoteSlice.reducer;