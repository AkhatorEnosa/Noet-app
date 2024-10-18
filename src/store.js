import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./reducers/apiSlice"

export const store = configureStore({
    reducer: {
        data: dataReducer
    }
})