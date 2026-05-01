import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {decodeUserFromToken} from '../../utils/jwt';
import { deleteRefreshToken } from '../../utils/tokenStorage';

interface AuthState {
  status: 'loading' | 'authenticated' | 'unauthenticated',
  accessToken: string | null,
  user: string | null,
}

const initialState : AuthState = {
  status: 'loading',
  accessToken: null,
  user: null, // { id }
};

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {dispatch}) => {
    await deleteRefreshToken();
    return true;
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      const { accessToken } = action.payload;

      const decoded = decodeUserFromToken(accessToken);
      console.log("Authslice jwt decode: ", decoded);

      state.status = 'authenticated';
      state.accessToken = accessToken;

      state.user = decoded.id;
    },

    setUnauthenticated: (state) => {
      state.status = 'unauthenticated';
      state.accessToken = null;
      state.user = null;
    },

    setLoading: (state) => {
      state.status = 'loading';
    },

    updateAccessToken: (state, action) => {
      const accessToken = action.payload;
      const decoded = decodeUserFromToken(accessToken);

      state.accessToken = accessToken;
      state.user = decoded.sub;
    },
  },
  extraReducers: (builder)=> {
    builder.addCase(logout.fulfilled, (state) =>{
        state.status = 'unauthenticated';
        state.accessToken = null;
        state.user = null;
    });
  }
});



export const {
  setAuthenticated,
  setUnauthenticated,
  setLoading,
  updateAccessToken,
} = authSlice.actions;

export default authSlice.reducer;
