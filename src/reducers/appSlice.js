import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../config/supabaseClient.config';

const initialState = {
  user: null,
  loggedIn: false,
  error: null,
  isLoading: false,
};

export const signIn = createAsyncThunk('api/signIn', async() => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
    })

    if (error) throw error
    return data
})

export const getUser = createAsyncThunk('api/getUser', async() => {
  const { data: { user }, error } = await supabase.auth.getUser()

  if(error) throw error
  return user
})

export const signOut = createAsyncThunk('api/signOut', async() => {
  const { data, error } = await supabase.auth.signOut()

  if(error) throw error
  return data
})


const appSlice = createSlice({
  name: 'api',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state) => {
        state.loggedIn = true;
        state.isLoading = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loggedIn = true;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null; 
        state.notes = null;
        state.isLoading = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.error = "signOut", action.error.message;
        state.notes = null
        state.isLoading = false;
      })
  },
});

// export const { shuffleNoets } = appSlice.actions;
export default appSlice.reducer;