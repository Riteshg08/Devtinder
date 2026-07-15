import { configureStore } from "@reduxjs/toolkit";

// Importing reducers from different slices
// Each reducer manages one part(slice) of the Redux state
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";

// Creating the main Redux store
const appStore = configureStore({

    // reducer object combines all slice reducers
    reducer: {

        // "user" is the key inside Redux store
        // state.user will be managed by userReducer
        user: userReducer,

        // state.feed managed by feedReducer
        feed: feedReducer,

        // state.connections managed by connectionReducer
        connections: connectionReducer,

        // state.request managed by requestReducer
        request: requestReducer
    }
});

// Exporting store so entire app can access Redux state
export default appStore;