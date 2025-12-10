import { AuthState, User } from '@/interfaces/authentication';
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isUserLoading: true,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: ( state, action: PayloadAction<{token: string, user: User}>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isUserLoading = false
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isUserLoading = true;
    },
  }
})

export const { setCredentials, logout} = authSlice.actions;
export default authSlice.reducer