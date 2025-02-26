import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "./reducers/apiSlice"

export const store = configureStore({
    reducer: {
        data: apiReducer
    },
    // devTools: false
})