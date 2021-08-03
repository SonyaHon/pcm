import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';
import { api } from '../api';

export interface UserSliceState {
    loggedIn: boolean;
    user?: {
        username: string;
        id: string;
        role: string;
    }
}

export const initialState: UserSliceState = {
  loggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setup(state, action: PayloadAction<UserSliceState>) {
      state.loggedIn = action.payload.loggedIn;
      state.user = action.payload.user;
    },
  },
});

export const { setup } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoggedIn = (state: RootState) => state.user.loggedIn;

export const loginUser = (username: string, password: string) => async (dispatch: AppDispatch) => {
  const result = await api.user.login(username, password);
  dispatch(setup({
    loggedIn: true,
    user: result,
  }));
};

export const fetchUser = () => async (dispatch: AppDispatch) => {
  try {
    const result = await api.user.fetchSelf();
    dispatch(setup({
      loggedIn: true,
      user: result,
    }));
  } catch (error) {
    console.error(error);
  }
};

export const userReducer = userSlice.reducer;
