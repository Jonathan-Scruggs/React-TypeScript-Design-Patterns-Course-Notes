

### Creating A React + TypeScript Project:
- We can create a React + TypeScript project using the vite build tool.
`npm create vite@latest`
- the `tsconfig.json` file is a file used to configure TypeScript. Specifies how the TypeScript will be transpiled. 
- `vite.config.ts` automatically converts our TypeScript to JavaScript code.


### Role Of tsconfig.json:
- Contains the configuration of the TypeScript compiler. 

### Defining Component Prop Types:
- `props` are a object that contain key value pairs of our choice. For instance props could have a title prop. 
```tsx
<CourseGoal title="Learn React + TS" description="Learn it from the ground up"/>
```

```tsx
export default function CourseGoal(props: {
    title: string, description: string
}){
    return <article>
        <div>
            <h2>TITLE</h2>
            <p>DESCRIPTION</p>
        </div>
        <button>Delete</button>
    </article>
}
```

- We can also do object destructuring in the parameter list:
```tsx
export default function CourseGoal({title, description}: {
    title: string, description: string
}){

    return <article>
        <div>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
        <button>Delete</button>
    </article>
}
```

### Storing Prop Types as Custom Type or Interface:
```tsx
type CourseGoalProps = {
    title: string,
    description: string
}

export default function CourseGoal({title, description}: CourseGoalProps){

    return <article>
        <div>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
        <button>Delete</button>
    </article>

}
```
- Alternatively you can use a interface.
### Defining a Type For Props With Children

```tsx
<CourseGoal title="Learn React + TS">
  <p>Learn it from the ground up</p>
</CourseGoal>
```

```tsx
import type { ReactNode } from "react";
interface CourseGoalProps {
    title: string;
    children: ReactNode
}
export default function CourseGoal({
    title, children
}: CourseGoalProps){
    return <article>
        <div>
            <h2>{title}</h2>
            {children}
        </div>
        <button>Delete</button>
    </article>
}
```
- Children in React tsx code are of type `ReactNode`.
- This Type came installed with the `@types/react`, `@types/react-dom` packages. The ReactNode type is from the `@types/react` package.
- The `type` decorator that makes it clear to the **build tool that this import can be removed later when the code runs in the browser.**

- The alternative is the `PropsWithChildren` type:
```tsx
type CourseGoalProps = PropsWithChildren<{title: string}>
```
### Component Props and The Special Key Prop:
- React Components accept a special `key` prop which is used by React to track specific component instances. 
- The `key` prop should always be set when outputting a list of components.
- The `key` prop can be set on custom components even if you don't specify it as a prop in your prop types.

### Another Way To Type Components:
- We can use a arrow function for our components.
```tsx
import type { FC, ReactNode } from "react";

  

interface CourseGoalProps {

    title: string;

    children: ReactNode

}

const CourseGoal: FC<CourseGoalProps> = ({title, children}) => {
    return <article>
        <div>
            <h2>{title}</h2>
            {children}
        </div>
        <button>Delete</button>
    </article>
}

export default CourseGoal
```
- FC stands for functional component and is a generic type. Since `FC` is a generic type `CourseGoalProps` is the type parameter to the generic `FC` type.
- This means `CourseGoal` is a functional component that expects props of `CourseGoalProps`.

### `useState` and TypeScript:
```tsx
const [goals, setGoals] = useState([]);
```
- If we just use the `useState` how we would in a JavaScript React project, goals will be of type `never` which is TypeScripts way of saying the array is of unknown type and thus the array can never contain any elements.
- `useState` is actually a generic function that we can pass a type parameter to.
```tsx
const [goals, setGoals] = useState<CourseGoal[]>([])
```
- The above code says goals should be of type CourseGoal ands its initial value is a empty array.

### DRY TYPES:
- Its generally bad practice to have the same type declaration spread across multiple files. Because if we every decide to change one of these type definitions we have to change it multiple places.
- The solution to this is we can **export types in TypeScript**. Simply add export keyword in front of type.
### Passing Functions As Values In A Type Safe Way

##### Note On Filter Function JavaScript:
- The `filter()` method **creates a new array** with all that elements that **pass a test implemented by the provided function.**
- The **filter method iterates through each element in the original array**, calls the callback function for each element and if the callback method returns `true` its included in the new array and if the call back returns `false` the **element is excluded from the new array.**

```tsx
interface CourseGoalListProps {
    goals: CGoal[],
    onDelete: (id: number) => void
}
```
- Based on the interface `onDelete` is a function that takes a **argument id of type number** and it **returns nothing.**
### Handling And Typing Events:
- We can use the `FormEvent` type to type form submission events.
- `event: FormEvent`.
- Note: If you wrote a inline event handler then `event` would automatically be inferred to be of type `FormEvent`.
### Working With Generic Event Types:
```tsx
export default function NewGoal(){
    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event?.preventDefault();
        new FormData(event.currentTarget); // Gets input values of form and makes them accessible.
    }
    return <form onSubmit={handleSubmit}>
        <p>
            <label htmlFor="goal">Your goal</label>
            <input id="goal" type="text"/>
        </p>
         <p>
            <label htmlFor="summary">Short summary</label>
            <input id="summary" type="text"/>
        </p>
        <p>
            {/* By Default submits form */}
            <button>Add Goal</button>
        </p>
    </form>
}
```
- `FormEvent` alone gives basic form event properties but if we use `FormEvent<HTMLFormElement>` tells TypeScript that `event.currentTarget` is specifically an HTMLFormElement which gives:
	- Better autocomplete/IntelliSense
	- Type safety when accessing form-specific properties
	- More precise error catching.
### `useRef` With TypeScript:
- `useRef` is a React hook that returns a mutable object whose `.current` persists for the full lifetime of the component.
- Persists between renders - the value doesn't reset when the component re-renders.
- Doesn't trigger re-renders when changed.
- Mutable.
```tsx
const inputRef = useRef<HTMLInputElement>(null);

const focusInput = () => {
  inputRef.current?.focus();
};

return (
  <div>
    <input ref={inputRef} type="text" />
    <button onClick={focusInput}>Focus Input</button>
  </div>
);
```

```tsx
const countRef = useRef(0);
const timerRef = useRef<NodeJS.Timeout | null>(null);

const startTimer = () => {
  timerRef.current = setInterval(() => {
    countRef.current += 1;
    console.log(countRef.current); // Won't trigger re-render
  }, 1000);
};

const stopTimer = () => {
  if (timerRef.current) {
    clearInterval(timerRef.current);
  }
};
```

```tsx
export default function NewGoal(){
    const goal = useRef<HTMLInputElement>(null) // useRef is also a generic
    const summary = useRef<HTMLInputElement>(null)

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event?.preventDefault();
        const enteredGoal = goal.current!.value; // Tells TypeScript that this will never be null
        const eneteredSummary = summary.current!.value;

    }

    return <form onSubmit={handleSubmit}>
        <p>
            <label htmlFor="goal">Your goal</label>
            <input id="goal" type="text" ref={goal}/>
        </p>
         <p>
            <label htmlFor="summary">Short summary</label>
            <input id="summary" type="text" ref={summary}/>
        </p>
        <p>
            {/* By Default submits form */}
            <button>Add Goal</button>
        </p>
    </form>
}
```

### Handling User Input In A Type Safe Way:
- 