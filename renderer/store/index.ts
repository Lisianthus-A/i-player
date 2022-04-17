import { configureStore } from "@reduxjs/toolkit";
import musicSlice from "./musicSlice";

const store = configureStore({
    reducer: {
        music: musicSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
