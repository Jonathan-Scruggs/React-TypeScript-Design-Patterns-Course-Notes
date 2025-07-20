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
  Won't have data when component first renders so we'll need to re-render when we finally
  receive the data.
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
