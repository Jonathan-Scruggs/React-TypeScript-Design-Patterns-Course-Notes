import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
    id: string;
    title: string;
    price: number;
    quantity: number;
}

type CartState = {
    items: CartItem[] 
}

const initialState: CartState = {
    items: []
}

/*
Define a slice of your redux state. A slice contains a 
name, initialState and reducers.
*/
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Object includes methods to manipulate state
        addToCart(state,
             action: PayloadAction<{id: string; title: string; price: number;}>
            ){
                const itemIndex = state.items.findIndex((item) => item.id === action.payload.id)

                if (itemIndex >= 0){
                    // We found the item so directly modify state
                    state.items[itemIndex].quantity++;
                } else {
                    // Didn't find item so its a new item
                    state.items.push({...action.payload, quantity: 1});
                }
            },
        removeFromCart(state, action: PayloadAction<string>){
            const itemIndex = state.items.findIndex((item) => item.id === action.payload)
            if (state.items[itemIndex].quantity === 1){
                state.items.splice(itemIndex, 1);
            } else {
                state.items[itemIndex].quantity--;
            }

        }
    }
});


export const {addToCart, removeFromCart} = cartSlice.actions