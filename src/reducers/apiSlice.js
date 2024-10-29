import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../config/supabaseClient.config';

const initialState = {
  notes: null,
  error: null,
  isLoading: false,
};

export const fetchData = createAsyncThunk(
  'api/fetchData',
  async () => {
    const { data, error } = await supabase.from('data').select().order('index_num', {
        ascending: false
    });
    return { data, error };
  }
);

const apiSlice = createSlice({
  name: 'api',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.notes = action.error.message;
        state.isLoading = false;
      });
  },
});

// export const { fetchData } = apiSlice.actions;
export default apiSlice.reducer;