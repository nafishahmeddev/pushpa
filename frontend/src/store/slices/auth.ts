import { IUser } from '@app/types/user'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthStateLoggedIn {
  user: IUser,
  accessToken: string,
  refreshToken: string,
  loggedIn: true,
  loading: boolean
}


export interface AuthStateLoggedOut {
  loggedIn: false,
  loading: boolean
}

export type AuthState = AuthStateLoggedIn | AuthStateLoggedOut;

const initialState: AuthState = {
  loggedIn: false,
  loading: true
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState as AuthState,
  reducers: {
    login: (state, action: PayloadAction<AuthStateLoggedIn>) => {
      state = action.payload;
      return state;
    },
    update: (state: AuthState, action: PayloadAction<AuthStateLoggedIn>) => {
      state = action.payload;
      return state;
    },

    logout: (state: AuthState) => {
      state = {
        loggedIn: false,
        loading: false
      };
      return state;
    },

  },
})

// Action creators are generated for each case reducer function
export const AuthReducer = authSlice.reducer;
export const AuthActions = authSlice.actions
