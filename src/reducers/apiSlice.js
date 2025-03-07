import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../config/supabaseClient.config';

const initialState = {
  user: null,
  notes: null,
  searchedNotes: null,
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

export const fetchData = createAsyncThunk('api/fetchData', async (id) => {
    const { data, error } = await supabase.
      from('data')
      .select()
      .eq('user_id', id)
      .order('index_num', {
        ascending: false
    });
    
    if(error) return error
    if (data) return data;
  }
);

export const searchData = createAsyncThunk('api/searchData', async ({ searchInput, id }) => {
    if(id) {
      const { data, error } = await supabase.
        from('data')
        .select()
        .ilike('data_value', `%${searchInput}%`)
        .eq('user_id', id)
        .order('index_num', {
          ascending: false
      });
      
      if(error) return error
      if (data) {
        // console.log(data);
        return data;
      }
    }
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
      })
      .addCase(searchData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchData.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.searchedNotes = action.payload;
        state.isLoading = false;
      })
      .addCase(searchData.rejected, (state, action) => {
        state.notes = action.error.message;
        state.searchedNotes = action.error.message;
        state.isLoading = false;
      })
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state) => {
        state.user = null; 
        state.isLoading = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = "signIn", action.error.message;
        state.notes = null
        state.isLoading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = "get User", action.error.message;
        state.notes = null
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

// export const { fetchData } = apiSlice.actions;
export default apiSlice.reducer;