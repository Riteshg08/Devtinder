import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: "request",
    initialState: [],
    reducers:{
        addRequests : (state,action) =>{
            return action.payload;
        },
        removeRequest: (state, action) => {
            const updatedRequests = state.filter(req => req._id !== action.payload);
            return updatedRequests;
        }
    },
});

export const {addRequests, removeRequest} = requestSlice.actions; 

export default requestSlice.reducer;