### Redux Setup:
- Redux is a predictable **state management library for JavaScript applications**, most commonly used with React.
1.) Open terminal
2.) `npm install @reduxjs/toolkit`
3.) Also install react redux package `react-redux`(allows us to connect redux to our react app).

##### What Redux is:
- Redux is a pattern and library for managing application state in a centralized store. It follows three core principles:
1.) **Single Source of truth:** Your entire application state lives in one place(called the store)
2.) **State is read-only**: You can't directly modify state, instead you must **dispatch actions**.
3.) **Changes** are made with **pure functions**: Reducers are **pure functions** that take the **current state** and an action, then **return a new state.**

#### Redux Workflow:
- **Actions** describe what happened (like "user clicked login button")
- **Reducers** specify how the state changes in response to actions
- **Store** holds the application state and provides methods to dispatch actions and subscribe to changes
- **Components** can access state from the store and dispatch actions


### Redux Store and First Slice:
1.) Add a store folder
2.) Add a `store.ts` file.
```tsx
import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./cart-slice";
/*
Creates Redux store. This serves as a sort of central database for your app's state.
This says there is a piece of state called "cart" and its managed by the cartSlice reducer
*/
configureStore({
    // reducer key tells Redux that here are the reducer functions that will manage pieces of state
    reducer: {
        cart: cartSlice.reducer
    }

}); // Creates a redux store
```

##### Setting State Type and Controlling Action Payload Type and Reducer Logic:
```tsx
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
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
```

### Providing the Redux Store:
- The React Redux package provides a component that allows you to make a Redux Store available to other components.
- This component should wrap all components that need to change the data in the store or read the data.
```tsx
import Header from './components/Header.tsx';
import Shop from './components/Shop.tsx';
import Product from './components/Product.tsx';
import { DUMMY_PRODUCTS } from './dummy-products.ts';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

function App() {
  return (
    <Provider store={store}>
      <Header />
      <Shop>
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} />
          </li>
        ))}
      </Shop>
    </Provider>
  );
}

export default App;
```

### Dispatching Actions and the `useDispatch` hook:
```tsx
const {addToCart, removeFromCart} = cartSlice.actions
```
- This line creates action objects which are then sent to redux which then invokes the correct reducers.
- We can import the `useDispatch` hook which when called to get a dispatch function which allows you to dispatch actions.
```tsx
import { useDispatch } from "react-redux";
const dispatch = useDispatch();
 function handleAddToCart() {
    dispatch(addToCart({id, title, price}));
  }
```

- However, it is recommend to create your own version of the `useDispatch` hook for **extra type safety.** Its common to create a `hooks.ts` file in the store folder.
```tsx
export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer
  }
});

export type AppDispatch = typeof store.dispatch;
```
- In the code above we create a TypeScript type that represents the store's dispatch function.
```tsx
type DispatchFunction = () => AppDispatch
export const useCartDispatch: DispatchFunction = useDispatch;
```
- This creates a typed version of the `useDispatch` hook. Which specifies what actions our store can handle. This adds the benefit of auto complete for available actions and catch errors if we try to dispatch invalid actions. 
- Thus when we call the custom `useCartDispatch` hook it will return a dispatch that only contains actions our store can handle.


### Type-Safe `useSelector` Hook:
- The `useSelector` hook is how **React components** read data from the **Redux store.**
- It's recommend by the official docs to create your own version of the `useSelector` hook.
```tsx
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
export type AppSelector = ReturnType <typeof store.getState>;
export type AppDispatch = typeof store.dispatch
```


```tsx
import {useDispatch, useSelector, type TypedUseSelectorHook} from "react-redux";

import { AppDispatch, RootState } from "./store";

  

type DispatchFunction = () => AppDispatch

export const useCartDispatch: DispatchFunction = useDispatch;

  
  

export const useCartSelector: TypedUseSelectorHook<RootState> = useSelector;
```
- This creates a more type aware version of the `useSelector` hook.
NOTE: You don't need to **re-create these hooks for each different slice** you only need to create it **once per redux store.**

### Selecting & Transforming Redux Store Data:
- We can navigate to the component where we want to use the state data and called our custom `useCartSelector()` hook.
```tsx
useCartSelector((state) => state.cart.items.reduce((val, item) => item.quantity + val, 0));
```
- The custom hook takes the **current state** as a argument and then the function is what **state data we want to extract.**
NOTE: The **reduce function** is used to accumulate the **items in a array into a single value**. 
- `val` is the current value and `item` is the actual item in the array.


### Dispatching Actions to Redux Store:
```tsx
import { useCartDispatch, useCartSelector } from "../store/hooks";

import { CartItem } from "../store/cart-slice";

import { addToCart, removeFromCart } from "../store/cart-slice";
export default function CartItems() {

  // Getting the current items in the cart
  const cartItems = useCartSelector(state => state.cart.items);

  const dispatch = useCartDispatch()

  const totalPrice = cartItems.reduce((val,item) => val + item.price * item.quantity,0)
  const formattedTotalPrice = totalPrice.toFixed(2);
  function handleAddToCart(item: CartItem){
    dispatch(addToCart(item));
  }

  function handleRemoveFromCart(id: string){
    dispatch(removeFromCart(id));
  }

  return (

    <div id="cart">
      {cartItems.length === 0 && <p>No items in cart!</p>}
      {cartItems.length > 0 && <ul id="cart-items">
          {cartItems.map((item) => {
            const formattedPrice = `$${item.price.toFixed(2)}`;
            return (
              <li key={item.id}>
                <div>
                  <span>{item.title}</span>
                  <span> ({formattedPrice})</span>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => handleRemoveFromCart(item.id)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleAddToCart(item)}>+</button>
                </div>
              </li>
            );
          })}
        </ul> }
       <p id="cart-total-price">
        Cart Total: <strong>${formattedTotalPrice}</strong>
      </p>
    </div>
  );
}
```
