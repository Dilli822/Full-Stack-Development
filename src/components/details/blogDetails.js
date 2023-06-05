import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";

import { Carousel } from "react-responsive-carousel"; // Import the Carousel component

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
            <div style={{ position: "fixed", zIndex: "99" }}></div>
            <Container maxWidth="sm" style={{ height: "auto", position: "relative" }}>
                <button>
                    {" "}
                    <Link to={`/blog/`}> Back </Link>
                </button>
            </Container>
            <br></br> <br></br>
            <Container maxWidth="sm" style={{ height: "auto", position: "relative" }}>
                <Container maxWidth="sm" style={{ height: "auto", position: "relative" }}>
                    <h2>Title: {blog.title}</h2>
                    <Carousel showThumbs={false}>
                        {blog.image ? <img style={{ maxWidth: "100%" }} src={`http://localhost:8000${blog.image}`} alt="Image" /> : <p>No image available</p>}
                        {blog.video ? (
                            <video controls style={{ maxWidth: "100%" }}>
                                <source src={`http://localhost:8000${blog.video}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <p>No video available</p>
                        )}
                    </Carousel>
                    <p>{blog.content}</p>
                    <p>Author: {blog.authorName}</p>
                    <p>Published Date: {blog.created_at}</p>
                    <p>Updated Date: {blog.updated_at}</p>
                    <p>Likes: {blog.likes}</p>
                    <p>Comments: {blog.total_comment}</p>
                    {/* <p>comments: {blog.total_comments} </p> */}
                </Container>
            </Container>
        </div>
    );
}
