import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";


export default function Profile() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/user/${id}/`, {
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
        <Container maxWidth="sm" style={{ height: "auto", position: "relative"}} >
        <div style={{ position: "fixed"}}><button>  <Link to={`/blog/`}> Back </Link></button></div>
        </Container>
        <br></br> <br></br>

<Container maxWidth="sm" style={{ height: "auto", position: "relative"}} >

<h2>Profile: {blog.title}</h2>
<img src={`http://localhost:8000${blog.image}`} style={{ width: "100%", maxWidth: "100%" }} />
      <p>{blog.content}</p>
      <p>Username: {blog.username}</p>
      <p>Email: {blog.email}</p>
      
      <p>First Name: {blog.first_name}</p>
      <p>Last Name: {blog.last_name} </p>
      <p>Account Created Date: {blog.date_joined}</p>
    </Container>

 
      

    </div>
  );
}
