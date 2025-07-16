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
function add(a: number, b: number){
    const result = a + b;
    return result;
}

// Creating Type Aliases
type AddFn = (a: number, b: number) => number;

function calculate(a: number, b: number, calcFn: AddFn){
    calcFn(a,b);
}

calculate(2,5, add);

interface Credentials {
    password: string;
    email: string;
}

let creds: Credentials;
creds = {
    password: "abc",
    email: "@email.com"
}

// // Merging Types
// type Admin = {
//     permissions: string[]
// };

// type AppUser = {
//     userName: string;
// }

// type AppAdmin = Admin & AppUser;

// Merging Types With Interface

interface Admin {
    permissions: string[]
};

interface AppUser {
    userName: string;
}
interface AppAdmin extends Admin, AppUser {}
let admin: AppAdmin;
admin = {
	permissions: ['login'],
	userName: 'Max'
}

// Literal Types
let role: Role; // 'admin', 'user', 'editor'
role = 'admin';
role = 'user';
role = 'editor';

type Role = 'admin' | 'user' | 'editor';

// Type Guards
function performAction(action: string, role: Role){
    // typeof operator can be used to get the type of operand value.
    if (role === 'admin' && typeof action === 'string'){
    } else if(role === 'user' ){
    }
}


let roles: Array<Role>; // Now roles array only accepts role strings
roles = ['admin', 'editor'];




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


// Generic Functions

// Can accept two parameters that use these placeholder types
function merge<T, U>(a: T, b: U){
    return {
        ...a,
        ...b
    }
}
const newUser = merge({name: "Jonathan"}, {age: 20});

