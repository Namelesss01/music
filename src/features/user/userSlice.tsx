import { createSlice } from '@reduxjs/toolkit';
import { UserData } from './types';

const initialState: UserData = {
  info: null,
  authIsReady: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.info = action.payload;
    },
    setAuthState: (state, action) => {
      state.authIsReady = action.payload;
    },
  },
});

export const { setUser, setAuthState } = userSlice.actions;
export default userSlice.reducer;
