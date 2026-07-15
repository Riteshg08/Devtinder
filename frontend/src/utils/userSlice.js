import { createSlice } from "@reduxjs/toolkit";

// createSlice automatically creates:
// 1. Reducer
// 2. Actions
// 3. Action types

const userSlice = createSlice({

    // Name of slice
    // Used internally for generating action types
    // Example: "user/addUser"
    name: "user",

    // Initial/default state
    // Initially no user is logged in
    initialState: null,

    // Reducers contain functions that update state
    reducers: {

        // addUser reducer
        // state -> current state
        // action -> object containing type + payload
        addUser: (state, action) => {

            // action.payload contains data sent during dispatch
            // Example:
            // dispatch(addUser(userData))

            // Returning payload as updated state
            return action.payload;
        },

        // removeUser reducer
        removeUser: (state, action) => {

            // Resetting state to null
            // Used during logout
            return null;
        }
    },
});

// Exporting automatically generated action creators
// Can be used like:
// dispatch(addUser(data))
export const { addUser, removeUser } = userSlice.actions;

// Exporting reducer so store can use it
export default userSlice.reducer;