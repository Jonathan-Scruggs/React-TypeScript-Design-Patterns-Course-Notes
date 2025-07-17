### Flexible Components With Required Prop Combinations
- We can make props optional by either adding `undefined` to accepted types or a `?` after the property.
```tsx
interface InfoBoxProps {
    mode: 'hint' | 'warning',
    children: ReactNode,
    severity?: 'low' | 'medium' | 'high';
};
```
- However, this isn't always the best solution. Sometimes we want **properties** to be optional only under **certain conditions.** 

### Components With Discriminated Unions:
```tsx
type HintBoxProps = {
    mode: 'hint';
    children: ReactNode
}
interface WarningBoxProps {
    mode: 'warning',
    children: ReactNode,
    severity: 'low' | 'medium' | 'high';
};

type InfoBoxProps = HintBoxProps | WarningBoxProps;

export default function InfoBox(props: InfoBoxProps)
```
- The **discriminator** is the `mode` property this is the key that **TypeScript uses to distinguish between the two types**.  
- When `mode: 'hint'` only `children` is allowed.
- When `mode 'warning'` both `children` and `severity` are required.
- The nice thing about this is **TypeScript** automatically **narrows the type** based on the `mode` value.
- This discriminated union feature you build different objects with different identification properties with different properties allows you build more flexible code.


### Wrapper Components:

#### Basic Wrapper Component:
```tsx
type InputProps = {
    label: string;
    id: string;
}
export default function Input({ label, id }: InputProps) {
    return (
        <p>
            <label htmlFor={id}>{label}</label>
            <input id={id} type="text" />
        </p>
    )
}
```

### Building Better Wrapper Components With `ComponentPropsWithoutRef`:
 - `ComponentPropsWithoutRef` does not add `ref` to the list of props whilst `ComponentPropsWithRef` does.
 - `ComponentPropsWithoutRef` gives you all the **standard HTML props** for a **specific element**, minus the `ref` prop.
```tsx
ComponentPropsWithoutRef<'input'> 
```
- The above code returns a **type** that includes all **standard input props**.
```tsx
import { ComponentPropsWithoutRef } from "react";
type InputProps = {
    label: string;
    id: string;
} & ComponentPropsWithoutRef<'input'>;
export default function Input({ label, id, ...props }: InputProps) {
    return (
        <p>
            <label htmlFor={id}>{label}</label>
            <input id={id} {...props} />
        </p>
    )
}
```
- Now are our **custom component** accepts custom props as well as **the default props**.


### Wrapper Component That Renders Different Elements:
```ts
import { ComponentPropsWithoutRef } from "react";

// Discriminated Union
type ButtonProps = {
    el: 'button';
} & ComponentPropsWithoutRef<'button'>

type AnchorProps = {
    el: 'anchor';
} & ComponentPropsWithoutRef<'a'>

export default function Button(props: ButtonProps | AnchorProps){
    // Return Anchor Element or Button
    if (props.el === 'anchor'){
        return <a className="button" {...props}></a>
    }
    return <button className="button" {...props}></button>
}
```

### Type Predicates:
```tsx
function isAnchorProps(props: ButtonProps | AnchorProps): props is AnchorProps{
    return 'href' in props;
}
```
- The return type is a Type Predicate. In this case whether or not props is of type `AnchorProps`. This tells TypeScript this function returns a Boolean, but if the Boolean value is `true`  this argument that has been passed is of a specific type.

```tsx
import { ComponentPropsWithoutRef } from "react";

// Discriminated Union
type ButtonProps = ComponentPropsWithoutRef<'button'>

type AnchorProps = ComponentPropsWithoutRef<'a'>

function isAnchorProps(props: ButtonProps | AnchorProps): props is AnchorProps{
    return 'href' in props;
}

export default function Button(props: ButtonProps | AnchorProps){

    // Return Anchor Element or Button
    if (isAnchorProps(props)){
        return <a className="button" {...props}></a>
    }
    return <button className="button" {...props}></button>
}
```
- One flaw to this component is you can mix and match props of the `a` and `button` type.  
- One way we can fix this merge the default props object with another custom object type where props that aren't supposed to belong to that object prop type are of type `never`.
```tsx
type ButtonProps = ComponentPropsWithoutRef<'button'> & {
    href?: never;
}
type AnchorProps = ComponentPropsWithoutRef<'a'> & {
    href?: string
}
```
- With this addition it helps **TypeScript distinguish between these two types**.

### Polymorphic Component:
- A **polymorphic component** is a **component** that can **render as different HTML** elements whilst maintaining the **same basic functionality.** 
```tsx
import { ElementType } from "react";
// Polymorphic Component
type ContainerProps = {
    as: ElementType // Receive identifier of component
};
export default function Container({as}: ContainerProps){
    const Component = as;
    return <Component />
}
```
- `ElementType` is a React type that represents any **valid JSX element** such as HTML tags.
- `as` prop: Receives the **identifier** of what **element/component** to render.
- **`const Component = as`** - Assigns the element type to a variable (capitalized so React treats it as a component)
### Better Polymorphic Component With Generics:
```tsx
import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

// Polymorphic Component
type ContainerProps<T extends ElementType> = {
    as?: T; // Receive identifier of component
    children: ReactNode;
} & ComponentPropsWithoutRef<T>;

export default function Container<T extends ElementType>({as, children}: ContainerProps<T>){
    const Component = as ||'div';
    return <Component className="container">{children}</Component>
}
```
- This polymorphic component takes a Generic Type Parameter. 
- `T extends ElementType` means "T can be any valid JSX element type"
- `as?` is a optional value that tells the polymorphic component what element to render.
- **The magic:** `ComponentPropsWithoutRef<T>` gives you all the correct props based on what `T` is!


### `forwardRef` With TypeScript:
- `forwardRef` allows a component to pass a **ref through to one of its child elements**, rather than keeping it for itself.
- A `ref` is kind of like a remote control that allows you to directly access and control a DOM element from your React component.
- **React treats `ref` specially** - it doesn't pass it as a prop like `placeholder` or `onClick`. Instead, it tries to attach it to the component itself.
`@react-refresh:208 Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?`
```tsx
import { ComponentPropsWithoutRef, forwardRef } from "react";

type InputProps = {
    label: string;
    id: string;
} & ComponentPropsWithoutRef<'input'>;
const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, id, ...props }, ref) {
    return (
        <p>
            <label htmlFor={id}>{label}</label>
            <input id={id} {...props} ref={ref}/>
        </p>
    )
})
export default Input
```
- `forwardRef` is a generic that wraps our entire custom component and it takes two values. 
- The first value is what the **ref points to (the actual DOM element).**
- The second value is the **props this component accepts - your custom prop interface**.

### Sharing Logic With unknown and Type Casting:

- TypeScript has a built in type called `unknown` is the **type-safe counterpart to `any`**. It represents a value that could be anything, but that you must check before using it.
```tsx
import { ComponentPropsWithoutRef, FormEvent } from "react"
type FormProps = ComponentPropsWithoutRef<'form'> & {
    onSave: (value: unknown) => void;
};
export default function Form({onSave, children, ...otherProps}: FormProps){

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);
        onSave(data);
    }

    return (
        <form onSubmit={handleSubmit} {...otherProps}>
        {children}
        </form>
    )
}
```

- The `as` keyword allows us to convert a type to a different type.

```tsx
import Input from './components/Input';
import Form from './components/Form';
import Button from './components/Button';
function App() {
  function handleSave(data: unknown) {
    const extractedData = data as {name: string; age: string};
    console.log(extractedData);
  }
  return (
    <main>
      <Form onSave={handleSave}>
          <Input type="text" label="Name" id="name" name=""/>    
          <Input type="number" label="Age" id="age" name=""/>    
          <p>
            <Button>Save</Button>  
          </p>
      </Form>
    </main>
  )
}
export default App;
```
- This tells TypeScript to cast data to a object with a name and age property of type string.

### Exposing Component APIs With `useImperativeHandle`:
- `useImperativeHandle`: is a rarely used **React hook that lets you customize what a parent component can access** when it uses a **ref on your component**.
- Normally with `forwardRef`, the parent gets access to the entire DOM element `useImperativeHandle` lets you control exactly what the parent can do - you can expose only specific method/properties.
##### When To Use:
- Custom input components
- Model/dialog components
- Complex widgets
- Allowing a custom function inside a component to be called by parent/outside of component.

```tsx
import { ComponentPropsWithoutRef, FormEvent, forwardRef, useImperativeHandle, useRef } from "react"

export type FormHandle = {
    clear: () => void;
}

type FormProps = ComponentPropsWithoutRef<'form'> & {
    onSave: (value: unknown) => void;
};

const Form = forwardRef<FormHandle, FormProps>(
    function Form({onSave, children, ...otherProps}, ref){
    const form = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => {
        return {
            clear(){
                console.log("CLEARING")
                form.current?.reset();
            }
        };
    });

  
    function handleSubmit(event: FormEvent<HTMLFormElement>) {

        event.preventDefault()

        const formData = new FormData(event.currentTarget);

        const data = Object.fromEntries(formData);

        onSave(data);

        form.current?.reset();

    }

  

    return (

        <form onSubmit={handleSubmit} {...otherProps} ref={form}>

        {children}

        </form>

    )

});

export default Form
```

```tsx
  

import Input from './components/Input';

import Form, { FormHandle } from './components/Form';

import Button from './components/Button';

import { useRef } from 'react';

function App() {

  

  const customForm = useRef<FormHandle>(null)

  

  function handleSave(data: unknown) {

    const extractedData = data as { name: string; age: string };

    console.log(extractedData);

    customForm.current?.clear();

  }

  return (

    <main>

      <Form onSave={handleSave} ref={customForm}>

        <Input type="text" label="Name" id="name" name="" />

        <Input type="number" label="Age" id="age" name="" />

        <p>

          <Button>Save</Button>

        </p>

      </Form>

    </main>

  

  )

}

  

export default App;
```
- `useImperativeHandle` makes the `clear()` method available in the parent app component via the ref in the parent App component to it.
- `useImperativeHandle` takes two arguments:
	1.) A ref that will eventually store a reference to the object returned by `useImperativeHandle`
	2.) A function that returns a object(the api you're exposing) which is returned by `useImperativeHandle`
### Avoiding Type Casting with `as`:
- If your not sure about the **type of value your dealing with at runtime** or if you want to be extra safe, you can use a **combination of Type Guards** to narrow down the **type until TypeScript is able to infer the final type.**
```tsx
1. function handleSave(data: unknown) {
2. // const extractedData = data as { name: string; age: string };
3. if (
4. !data ||
5. typeof data !== 'object' ||
6. !('name' in data) ||
7. !('age' in data)
8. ) {
9. return;
10. }

11. // at this point, TypeScript knows that data MUST BE an object
12. // with a name and age property
13. // otherwise, the previous if statement would have returned
14. console.log(data);
15. customForm.current?.clear();
16. }
```
