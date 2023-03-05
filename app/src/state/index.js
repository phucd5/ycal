import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  events: [],
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.log("No user!");
      }
    },
    setEvents: (state, action) => {
      state.events = action.payload.events;
    },
    setEvent: (state, action) => {
      const updatedEvents = state.posts.map((event) => {
        if (event._id === action.payload.event._id) return action.payload.event;
        return event;
      });
      state.events = updatedEvents;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setEvent, setEvents } =
  authSlice.actions;
export default authSlice.reducer;
