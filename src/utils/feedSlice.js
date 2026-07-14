import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        addUserToFeed: (state, action) => {
            return action.payload;
        },
        removeUserFromFeed: (state, action) => {
            const updatedFeed = state.filter((user) => user._id != action.payload);
            return updatedFeed;
        },
        restoreUserToFeed: (state, action) => {
            return [action.payload, ...(state || [])];
        }
    },
});

export const { addUserToFeed, removeUserFromFeed, restoreUserToFeed } = feedSlice.actions;

export default feedSlice.reducer;