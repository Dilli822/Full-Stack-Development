import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/blog/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <div style={{ position: "fixed", zIndex: "99"}}><button>  <Link to={`/blog/`}> Back </Link></button></div>
        <Container maxWidth="sm" style={{ height: "auto", position: "relative"}} >
      
        </Container>
        <br></br> <br></br>

<Container maxWidth="sm" style={{ height: "auto", position: "relative"}} >

<h2>Title: {blog.title}</h2>
<img src={`http://localhost:8000${blog.image}`} style={{ width: "100%", maxWidth: "100%" }} />
      <p>{blog.content}</p>
      <p>Author: {blog.authorName}</p>
      <p>Published Date: {blog.created_at}</p>
      <p>Updated Date: {blog.updated_at}</p>
      <p>Likes: {blog.likes}</p>
      {/* <p>comments: {blog.total_comments} </p> */}
    </Container>

 
      

    </div>
  );
}
