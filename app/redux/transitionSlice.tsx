import { createSlice } from "@reduxjs/toolkit";
import type { TransitionSlice } from "../types";

const transitionSlice = createSlice({
  name: "transition",
  initialState: {
    firstElemPos: { top: 0, left: 0, width: 0, height: 0 },
    secondElemPos: { top: 0, left: 0, width: 0, height: 0 },
    activeElemIndex: 0,
    allowTransition: false,
  } as TransitionSlice,
  reducers: {
    setFirstElemPos: (state, action) => {
      state.firstElemPos = action.payload;
    },
    setSecondElemPos: (state, action) => {
      state.secondElemPos = action.payload;
    },
    setActiveElemIndex: (state, action) => {
      state.activeElemIndex = action.payload;
    },
    setAllowTransition: (state, action) => {
      state.allowTransition = action.payload;
    },
  },
});

export const {
  setFirstElemPos,
  setSecondElemPos,
  setActiveElemIndex,
  setAllowTransition,
} = transitionSlice.actions;

export default transitionSlice.reducer;
