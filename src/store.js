import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/appSlice"
import privateNoteReducer from "./reducers/privateNoteSlice"
import publicNoteReducer from "./reducers/publicNoteSlice"

export const store = configureStore({
    reducer: {
        app: appReducer,
        privateNotes: privateNoteReducer,
        publicNote: publicNoteReducer 
    },
    devTools: true
})