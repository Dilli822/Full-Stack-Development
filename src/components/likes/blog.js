import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

export default function Likes() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [authorId,setAuthorId] = useState(0);
  const [countLikes, setCountLikes] = useState(0);
  const [likedBy,setLikedBy] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/blog/list/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = await response.json();

        // Initialize liked state for each blog post
        const blogsWithLiked = data.map((blog) => ({ ...blog, liked: false }));

        setBlogs(blogsWithLiked);
        setLikedBy(blogsWithLiked.liked_by);
        setCountLikes(blogsWithLiked);
        setAuthorId(blogsWithLiked.author);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch blog posts.");
      }
    };

    fetchBlogs();
  }, []);
  



  return (
    <div>
      {error && <p>{error}</p>}
      <h2>Blogs</h2>
      <div className="blogs">
        {blogs.map((blog) => (
          <div key={blog.id}>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <p>
              Author: {blog.author.first_name} {blog.author.last_name}
            </p>
            <p> {blog.liked_by}</p>
            <p>Likes: {blog.likes}</p>
liked/by{blog.liked_by} <br></br>
author id{blog.author_id}
{ 
  blog.liked_by.includes(blog.author) 
    ? <div>yes you liked</div>
    : <div>no you did not like</div>
}
<IconButton>
  <FavoriteIcon color={blog.liked_by.includes(blog.author_id) ? "error" : "primary"} />
</IconButton>


          </div>
        ))}
      </div>
    </div>
  );
}


