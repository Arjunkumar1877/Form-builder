import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  id?: string;
  name?: string;
  email: string;
  password: string;
};

type InitialStateType = {
  currentUser: UserType | null;
  error: string | null;
};

const initialState: InitialStateType = {
  currentUser: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {

    signInSuccess: (state, action: PayloadAction<UserType>) => {
      state.currentUser = action.payload;
      state.error = null;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
    },
  },
});

export const { signInSuccess, signOutSuccess } = userSlice.actions;

export default userSlice.reducer;
