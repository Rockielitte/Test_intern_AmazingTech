import { Account } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = Account & { role: string };
type StateType = {
  user: User | null;
};
const initialState: StateType = {
  user: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
