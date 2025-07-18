
### Creating A Context:
- Context is used to manage **cross component state**.
- Typical practice is store files related to context in a folder called `store`.
```tsx
import { createContext } from "react";
type Timer = {
    name: string;
    duration: number;
};

type TimersState = {
    isRunning: boolean;
    timers: Timer[];
};

// Second object contains methods for this state.
type TimersContextValue = TimersState & {
    addTimer: (timerData: Timer) => void,
    startTimers: () => void,
    stopTimers: () => void,
}

const TimersContext = createContext<TimersContextValue | null>(null);
```
- When we **create a context**, we need to provide the **default value** for the type and in order for null to be valid we need it in the **type parameter of the generic.**

### Creating A Provider Component:
- Its quite common to create a special component that will be responsible for managing the state of the context and making the context available.
```tsx
export default function TimersContextProvider({children}: TimersContextProviderProps){
    const ctx: TimersContextValue = {
        timers: [],
        isRunning: false,
        addTimer(timerData) {
            // ...
        },
        startTimers() {
        },
        stopTimers() {

        },
    }

    return <TimersContext.Provider value={ctx}>
    </TimersContext.Provider>
}
```
- Then we should **wrap all the components that should be able to interact with the context**.
```tsx
function App() {
  return (
    <TimersContextProvider>
      <Header />
      <main>
        <AddTimer />
        <Timers />
      </main>
    </TimersContextProvider>
  );
}
```


### Accessing Context In A Type-Safe Way:
- We can create a **custom hook** to in order to safely access **context and obtain better TypeScript support.**
```tsx
import { useContext } from 'react';
import Button from './UI/Button.tsx';
import { TimersContext } from '../store/timers-context.tsx';

export default function Header() {


  const timersCtx = useContext(TimersContext)!;
  return (
    <header>
      <h1>ReactTimer</h1>
      <Button>Stop Timers</Button>
    </header>
  );
}
```
- TypeScript by default will think `timersCtx` could be null. One way to get around this is by adding a `!` after our `useContext`.
- Another alternative would be to add a **guard** that checks if `timersCtx` is null.
- However, having to add either of this to every component that wants to use this context is tedious and easy to forget.
- One common pattern to address this is to **create a custom hook**.
```tsx
export function useTimersContext(){
    const timersCtx = useContext(TimersContext);
    if (timersCtx === null){
        throw new Error('TimersContext is null - that should not be the case!');
    }
    return timersCtx;
}
```
- The **advantage of this custom hook is we can now go to any component** and just call this **hook to use the context.**
```tsx
import Button from './UI/Button.tsx';

import { useTimersContext } from '../store/timers-context.tsx';

export default function Header() {
  const timersCtx = useTimersContext();
  return (
    <header>
      <h1>ReactTimer</h1>
      <Button>{timersCtx.isRunning ? 'Stop' : 'Start'}</Button>
    </header>
  );
}
```

```tsx
import { createContext, ReactNode, useContext } from "react";
type Timer = {
    name: string;
    duration: number;
};
type TimersState = {
    isRunning: boolean;
    timers: Timer[];
};
// Second object contains methods for this state.
type TimersContextValue = TimersState & {
    addTimer: (timerData: Timer) => void,
    startTimers: () => void,
    stopTimers: () => void,
}

const TimersContext = createContext<TimersContextValue | null>(null);
export function useTimersContext(){
    const timersCtx = useContext(TimersContext);
    if (timersCtx === null){
        throw new Error('TimersContext is null - that should not be the case!');

    }
    return timersCtx;

}


type TimersContextProviderProps = {
    children: ReactNode
};

  
  

export default function TimersContextProvider({children}: TimersContextProviderProps){
    const ctx: TimersContextValue = {
        timers: [],
        isRunning: false,
        addTimer(timerData) {
            // ...
        },
        startTimers() {
        },

        stopTimers() {
        },
    }

    return <TimersContext.Provider value={ctx}>
    </TimersContext.Provider>
}
```
- Now when we use `timersCtx` TypeScript in fact knows that it will never be null.
### `useReducer()` and TypeScript:
- `useReducer` is an alternative to `useState` for managing complex state logic. Essentially works like **mini Redux.**
```ts
const [state, dispatch] = useReducer(reducer, initialState);
```
- `state`: current state value
- `dispatch`: function that is used to trigger state changes.
- `reducer`: A function that determines how the state should change.
- **`initialState`** - starting state value
```tsx
import { useReducer } from 'react';
// 1. Define action types
type CounterAction = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'set'; payload: number };
// 2. Define reducer function
function counterReducer(state: number, action: CounterAction): number {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    case 'reset':
      return 0;
    case 'set':
      return action.payload;
    default:
      return state;
  }
}
// 3. Use in component
function Counter() {
  const [count, dispatch] = useReducer(counterReducer, 0);  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'set', payload: 100 })}>Set to 100</button>
    </div>
  );
}
```
- `useReducer` is primarily used for complex state objects, multiple related state updates, state logic that depends on previous state and when you need predictable state transitions.

Note: `addTimer({name: extractedData.name, duration: +extractedData.duration });`
- The `+` operator is the **unary plus operator** that **converts the value to a number.** This is commonly used when **unsure if the value is a number or a string**.