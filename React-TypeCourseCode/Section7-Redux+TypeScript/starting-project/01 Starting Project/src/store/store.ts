import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./cart-slice";

/*
Creates Redux store. This serves as a sort of central database for your app's state.
This says there is a piece of state called "cart" and its managed by the cartSlice reducer
*/

export const store = configureStore({
    // reducer key tells Redux that here are the reducer functions that will manage pieces of state
    reducer: {
        cart: cartSlice.reducer
    }
}); // Creates a redux store

// Gets the type of the return value of the getState method of our store
export type RootState = ReturnType <typeof store.getState>;
export type AppDispatch = typeof store.dispatch 
