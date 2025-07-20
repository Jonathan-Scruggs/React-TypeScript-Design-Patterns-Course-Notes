### Creating a Side Effect:
- The `useEffect()` hook in React lets you perform **side effects in functional components**.
- Runs code after the component renders.
- Handles side effects like API calls and timers.
- Can be used to clean up resources when the component unmounts.

```tsx
import { useEffect } from 'react';

useEffect(() => {
  // Side effect code here
}, [dependencies]);
```

```tsx
 useEffect(() => {
    setInterval(function(){
    setRemainingTime(prevTime => prevTime - 50);
  }, 50);
  }, []);
```
- Empty dependency array so the function inside of `useEffect` only runs when the component **first mounts and not every render**. (Does not run on subsequent re-renders).

- Whilst **dependencies** in array runs when the **component first mounts** and whenever those **dependencies change.**
- `useEffect` doesn't really change with or without TypeScript.

### Managing Interval With refs and Cleanup:
- `setInterval` returns a timer reference.
- However, since we are using `setInterval` inside of `useEffect` we can't maintain access to it easily. Instead we can use a `ref` to the timer.
```tsx
const interval = useRef<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(duration * 1000);
  if (remainingTime <= 0 && interval.current){
      clearInterval(interval.current)
  }
  useEffect(() => {
    interval.current = setInterval(function(){
    setRemainingTime(prevTime => prevTime - 50);
  }, 50);
  }, []);
```

**Note:** React strict mode runs every component twice when that component is rendered, thus setting two intervals. React does this to help us catch bugs in our code.

- So its important to clean up our **intervals when the component unmounts**.

- We can add a **return value** to `useEffect` which is a **function** that is **automatically called when it runs again or is unmounted.**
```tsx
const interval = useRef<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(duration * 1000);
  if (remainingTime <= 0 && interval.current){
      clearInterval(interval.current)
  }
  useEffect(() => {
    const timer = setInterval(function(){
    setRemainingTime(prevTime => prevTime - 50);
  }, 50);
  interval.current = timer;
    return () => clearInterval(timer);
  }, []);
```
- When we assign `timer` in the `useEffect` block its scoped to this `useEffect` and thus we can use it in the **cleanup and this is typically best practice.** 


#### `useEffect` and its Dependencies:

```tsx
const interval = useRef<number | null>(null);

  const [remainingTime, setRemainingTime] = useState(duration * 1000);
  const {isRunning} = useTimersContext();
  if (remainingTime <= 0 && interval.current){
      clearInterval(interval.current)
  }
  useEffect(() => {
    let timer: number;
    if (isRunning) {
      timer = setInterval(function(){
      setRemainingTime(prevTime => {
        if (prevTime <= 0){
          return prevTime;
        }
        return prevTime - 50;
      });
    }, 50);
    interval.current = timer;
    } else if (interval.current) {
      clearInterval(interval.current)
    }

    return () => clearInterval(timer);
  }, [isRunning]);
```
- This `useEffect` function runs every time the `isRunning` dependency variable changes which is a **part of our TimersContext state.**

### Data Fetching:
- **TanStack Query** is a library that deals with **fetching data in React apps**.


##### Utility Get Function
- When we receive data from a backend api TypeScript has no idea what form the response is. We can use **third party libraries** like **Zod for data validation**. 
- However, we can also simply use the `unknown` type to let TypeScript know that the incoming data is unknown.
```tsx
export async function get(url: string){
    const response = await fetch(url);
    if(!response.ok){
        throw new Error('Failed to fetch data.');
    }

    // Success Response
    const data = response.json() as unknown;
    return data;
}
```


#### Fetching and Transforming Data:
```tsx
import { ReactNode, useEffect, useState } from "react";
import { get } from "./util/http";
import BlogPosts, { BlogPost } from "./components/BlogPosts";

import fetchingImg from "./assets/data-fetching.png"
type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
}
function App() {
  /*

  Won't have data when component first renders so we'll need to re-render when we finally

  receive the data.
  */
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {

    async function fetchPosts() {
      const data = await get('https://jsonplaceholder.typicode.com/posts') as RawDataBlogPost[];
      const blogsPosts: BlogPost[] = data.map(rawPost => {
        return {
          id: rawPost.id,
          title: rawPost.title,
          text: rawPost.body
        }

      }); // Map yields a new array of data

      setFetchedPosts(blogsPosts); // This causes component to be re-rendered.
    }

    fetchPosts()

  }, []);

  let content: ReactNode;

  if (fetchedPosts){
    content = <BlogPosts posts={fetchedPosts}/>
  }

  return (
    <main>
      <img src={fetchingImg} alt="An abstract image depicting a data fetching process."/>
      {content}
    </main>
  );
}

export default App;
```

### Using Zod Library For Data Validation:
- You can install Zod by running `npm install zod`.
- You can **define schema's for data your trying to validate.**
```tsx
import { z } from 'zod';

const rawDataBlogPostSchema = z.object({
	id: z.number(),
	userId: z.number(),
	title: z.string(),
	body: z.string(),
});
```
- This is still **JavaScript code** but during development **TypeScript will be able to infer the type** of values that will **parsed / validated via that schema.** 
- Then you'd parse data according to that schema:
```tsx
const parsedData = rawDataBlogPostSchema.parse(someData)
```


### Generic `get` utility Function:
- An alternative to the earlier `get` function is we could have made it a **generic function** that accepts the **expected return value type as a type argument**.

```tsx
export async function get<T>(url: string) {
	 const response = await fetch(url);

	if (!response.ok) {
		throw new Error('Failed to fetch data.');
	}

	const data = await response.json() as unknown;
		return data as T;
}
```
- Now the **Type Casting assertion takes place inside the get function** which forces TypeScript to treat the **returned valued as data Type `T`.**

- Alternatively we could also modify this function by allowing our `get` function to accept a second parameter that is of type `ZodType`. This schema could then be used inside of the `get` function to parse the received response. 
- The advantage of this is that Zod will throw an error if the parsing fails, so TypeScript knows that if it succeeds the data will a value of the type defined by the Zod Schema.
```tsx
1. import { z } from 'zod';

2. export async function get<T>(url: string, zodSchema: z.ZodType<T>) {
3. const response = await fetch(url);

4. if (!response.ok) {
5. throw new Error('Failed to fetch data.');
6. }

7. const data = (await response.json()) as unknown;

8. try {
9. return zodSchema.parse(data);
10. } catch (error) {
11. throw new Error('Invalid data received from server.');
12. }
13. }
```
- Additionally no type casting is needed where the `get` function is used as its type will just be that Zod Schema.
```tsx
1. import { z } from 'zod';

2. const rawDataBlogPostSchema = z.object({
3. id: z.number(),
4. userId: z.number(),
5. title: z.string(),
6. body: z.string(),
7. });

8. const data = await get('https://jsonplaceholder.typicode.com/posts', z.array(rawDataBlogPostSchema));
9. data[0].userId; // works => TypeScript knows that userId will exist on the returned data
```

### Loading and Error States:
- We can use **loading and error states to render different things depending** on how our **data fetching is going.**
```tsx
import { ReactNode, useEffect, useState } from "react";
import { get } from "./util/http";
import BlogPosts, { BlogPost } from "./components/BlogPosts";
import fetchingImg from "./assets/data-fetching.png"
import ErrorMessage from "./components/ErrorMessage";
type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
}
function App() {
  /*
  Won't have data when component first renders so we'll need to re-render when we finally receive the data.
  */
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();
  
  useEffect(() => {
     // Setting isFetching to true since we are currently attempting to get the posts
    async function fetchPosts() {
      setIsFetching(true)
      try {
        const data = await get('https://jsonplaceholder.typicode.com/posts') as RawDataBlogPost[];
        const blogsPosts: BlogPost[] = data.map(rawPost => {
        return {
          id: rawPost.id,
          title: rawPost.title,
          text: rawPost.body
        }

      }); // Map yields a new array of data
      setFetchedPosts(blogsPosts);
      }

  

      catch(error) {
        if (error instanceof Error){
          setError(error.message);
        }
      }
      setIsFetching(false); // Finish fetching the posts
    }
    fetchPosts()

  }, []);

  let content: ReactNode;

  if (error) {
    content = <ErrorMessage text={error}/>
  }


  if (fetchedPosts){
    // Rendering paragraph whilst fetching
    content = <BlogPosts posts={fetchedPosts}/>
  }

  
  if (isFetching){
    content = <p id="loading-fallback">Fetching posts...</p>
  }
  return (
    <main>
      <img src={fetchingImg} alt="An abstract image depicting a data fetching process."/>
      {content}
    </main>
  );
}

export default App;
```