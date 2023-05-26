import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from "@mui/icons-material/Comment";

function SharePostTemplates() {
  const [blogs, setBlogs] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState([]);
  const [comments, setComments] = useState([]);
  
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/blog/likes/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = await response.json();
        const blogLikes = data.map((blog) => {
          return {
            id: blog.id,
            likes: blog.likes,
            liked_state: blog.liked_state,
            title: blog.title,
            image: blog.image,
            content: blog.content,
            authorName: blog.authorName,
            created_at: blog.created_at,
            updated_at: blog.updated_at,
     
          };
        });

        setBlogs(blogLikes);
        setLikes(blogLikes.map((blog) => blog.likes));
        setLiked(blogLikes.map((blog) => blog.liked_state));
        console.log(blogLikes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLikes();
  }, []);

  const handleLike = async (blogId, currentLikedState, index) => {
    try {
      const response = await fetch(`http://localhost:8000/api/blog/likes/update/${blogId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ liked: !currentLikedState }),
      });

      if (response.ok) {
        // update liked state for the current blog
        const updatedBlogLikes = [...blogs];
        updatedBlogLikes[index].liked_state = !currentLikedState;
        if (currentLikedState) {
          updatedBlogLikes[index].likes--;
        } else {
          updatedBlogLikes[index].likes++;
        }
        setBlogs(updatedBlogLikes);

        // update total likes count
        const updatedLikes = [...likes];
        if (currentLikedState) {
          updatedLikes[index]--;
        } else {
          updatedLikes[index]++;
        }
        setLikes(updatedLikes);

        // update liked state
        const updatedLiked = [...liked];
        updatedLiked[index] = !currentLikedState;
        setLiked(updatedLiked);
      } else {
        console.error("Error updating like state");
      }
    } catch (error) {
      console.error(error);
    }

  
  };


      


  return (
    <div>
    {blogs.map((blog, index) => (
    <div key={blog.id}>
    <h2>Title: {blog.title}</h2>
    <h3>Blog Id: {blog.id}</h3>
  
          <img src={`http://localhost:8000${blog.image}`} style={{ width: "450px", maxWidth: "100%" }} />
          <p>content: {blog.content}</p>
          <p>Author: {blog.authorName}</p>
          <p>Published Date: {blog.created_at}</p>
          <p>Updated Date: {blog.updated_at}</p>
         
          <br></br>
          
          <p>{likes[index]} Likes</p>
          <IconButton onClick={() => handleLike(blog.id, blog.liked_state, index)}>
            {liked[index] ? <FavoriteIcon color="error" style={{ width:"30px",height:"30px"}}/> : <FavoriteIcon color="black"  style={{ width:"30px",height:"30px"}}/>}
          </IconButton>
          
  
        </div>
      ))}
    </div>
    );
    }

export default SharePostTemplates;
