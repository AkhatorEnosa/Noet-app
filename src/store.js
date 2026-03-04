import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/appSlice"
import notesReducer from "./reducers/notesSlice"
import publicNoteReducer from "./reducers/publicNoteSlice"

export const store = configureStore({
    reducer: {
        app: appReducer,
        notes: notesReducer,
        publicNote: publicNoteReducer 
    },
    devTools: true
})