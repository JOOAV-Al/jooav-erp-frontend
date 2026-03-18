import Cookies from "js-cookie";
import { AuthState } from '@/features/auth/types';
import { User } from '@/interfaces/authentication';
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

const initialState: AuthState = {
  user: null,
  token: null,
  cartDraftNumber: null,
  isAuthenticated: false,
  isUserLoading: true,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: ( state, action: PayloadAction<{token: string, user: User}>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.cartDraftNumber = action.payload.user?.wholesalerProfile?.draftCart;
      state.isAuthenticated = true;
      state.isUserLoading = false
      Cookies.set("authToken", action.payload.token, {
        sameSite: "strict",
      });
    },
    updateCartNumber: (state, action: PayloadAction<{orderNumber: string | null}>) => {
      state.cartDraftNumber = action.payload.orderNumber;
    },
    logout: (state) => {
      state.isUserLoading = true;
      state.token = null;
      state.cartDraftNumber = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  }
})

export const { setCredentials, logout, updateCartNumber} = authSlice.actions;
export default authSlice.reducer