import { createSlice } from "@reduxjs/toolkit";
import type { TransitionSlice } from "../types";

const emptyPosition = { top: 0, left: 0, width: 0, height: 0 };

const transitionSlice = createSlice({
  name: "transition",
  initialState: {
    firstElemPos: emptyPosition,
    secondElemPos: emptyPosition,
    activeElemIndex: 0,
    allowTransition: false,
  } as TransitionSlice,
  reducers: {
    setFirstElemPos: (state, action) => {
      state.firstElemPos = action.payload;
    },
    resetFirstElemPos: (state) => {
      state.firstElemPos = emptyPosition;
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
  resetFirstElemPos,
  setSecondElemPos,
  setActiveElemIndex,
  setAllowTransition,
} = transitionSlice.actions;

export default transitionSlice.reducer;
