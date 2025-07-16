```ts
// Object Types:

let user: User;
type User = {
    name: string,
    age: number,
    isAdmin: boolean,
    id: string | number;
}
user = {
    name: 'Max',
    age: 34,
    isAdmin: true,
    id: 'abc'
};
```
### Defining Function Types:
```ts
function calculate(a: number, b: number, calcFn: (a: number, b: number) => number){
    calcFn(a,b);
}
calculate(2,5, add);
``` 
- `calcFn` has the type function that takes in two parameters `a` and `b` which are both of type number and returns a value of type number.
### Custom Types and Type Aliases:
```ts
// Creating Type Aliases
type AddFn = (a: number, b: number) => number;
function calculate(a: number, b: number, calcFn: AddFn){
    calcFn(a,b);
}
calculate(2,5, add);
```
- AddFn is a type alias for a function that takes in two inputs that are numbers and returns a number.
```ts
type User = {
    name: string,
    age: number,
    isAdmin: boolean,
    id: string | number;
}
```
### Defining Object Type With Interface:
```ts
interface Credentials {
    password: string;
    email: string;
}
let creds: Credentials;
creds = {
    password: "abc",
    email: "@email.com"
}
```
### Interface Vs Custom Types:
- **type** can allow you to define more **types other than just object types**. Whilst **interfaces** can also be used to define **function types you can't use a interface to store a union type for instance**.
- One advantage to **interfaces is that you can force classes to implement a interface**.
#### Interface Use Cases:
- Interfaces are best for defining object shapes
#### Type Alias - Best for complex Types:
- Type Alias are best when defining complex types.
### Merging Types:
```ts
// Merging Types

type Admin = {
    permissions: string[]
};
type AppUser = {
    userName: string;
}
type AppAdmin = Admin & AppUser;
```
- The `&` operator allows us to merge types together. Now AppAdmin must have both the permissions and userName property.
- We can also **merge types** that are defined by the `interface` keyword.
```ts
// Merging Types With Interface
interface Admin {
    permissions: string[]
};

interface AppUser {
    userName: string;
}

interface AppAdmin extends Admin, AppUser {
}
let admin: AppAdmin;
admin = {
	permissions: ['login'],
	userName: 'Max'
}
```
- AppAdmin is a interface that extends both Admin and AppUser.

### Being Specific With Literal Types:
```ts
// Literal Types
let role: 'admin' | 'user' | 'editor'; // 'admin', 'user', 'editor'
```
- `role` must be one of the literal types of `admin`, `user` or `editor`.

### Type Guards:
```ts
type Role = 'admin' | 'user' | 'editor';
// Type Guards
function performAction(action: string, role: Role){
    // typeof operator can be used to get the type of operand value.
    if (role === 'admin' && typeof action === 'string'){
    } else if(role === 'user' ){
    }
}
```
- When using *Type Guards*(if statements that check which concrete type is being used), TypeScript performs so called Type Narrowing. This means that **TypeScript** is able to narrow a **broader type down to a more specific type.** 

#### Other Type Guards:
- `typeof` operator to check what object type your dealing with.
- `instanceof` operator to check if an object value is based on some specific class.
- `in` operator to check if a object contains a specific property.

Note: You can't check if a **value meets a definition of a custom type as when the TypeScript is transpiled to JavaScript no equivalent features to achieve that exist**. Therefore since those if checks need to run at runtime, you can't write any code **that would be able to check for those types at runtime.**


### Generic Types:
- Generic Types and functions are types  and functions that can work with other types.
```ts
// T is a Type placeholder. You can also have multiple placeholders.
type DataStorage<T> = {
    storage: T[]; // Storage is an array that stores values of Type T.
    add: (data: T) => void;
};
const textStorage: DataStorage<string> = {
    storage: [],
    add: (data) => {
        this.storage.push(data);
    }
};

// Expects User Data
const userStorage: DataStorage<User> = {
    storage: [],
    add: (data) => {
        this.storage.push(data);
    }
}
```
- The nice thing about generics is we can define them once in a flexible way and then we can use them in different ways for whatever we need to do.


- We can also define generic functions that can work with a wide range of types.

```ts
// Generic Functions
// Can accept two parameters that use these placeholder types
function merge<T, U>(a: T, b: U){
    return {
        ...a,
        ...b
    }
}
const newUser = merge<{name: string},{age: number}>({name: "Jonathan"}, {age: 20});
```