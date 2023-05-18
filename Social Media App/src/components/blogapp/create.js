import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Update from "./update";
import { useNavigate } from 'react-router-dom';

function Create() {
    const [loading, setLoading] = useState(true);
    const [newBlogTitle, setNewBlogTitle] = useState("");
    const [newBlogContent, setNewBlogContent] = useState("");
    const [newBlogAuthorName, setNewBlogAuthorName] = useState("");

    const [blogs, setBlogs] = useState([]);
    const [selectedBlogId, setSelectedBlogId] = useState("");
    const [updatedBlogTitle, setUpdatedBlogTitle] = useState(undefined);
    const [updatedBlogContent, setUpdatedBlogContent] = useState(undefined);
    const [updatedBlogAuthorName, setUpdatedBlogAuthorName] = useState(undefined);

    const [newBlogImage, setNewBlogImage] = useState(null);
    const [updatedBlogImage, setUpdatedBlogImage] = useState(null);

    const [imageUrl, setImageUrl] = useState(null);

    const [created_at, setCreatedAt] = useState("");
    const accessToken = localStorage.getItem("accessToken");
    const tokenParts = accessToken.split(".");

    // Decode the access token payload
    const payload = JSON.parse(atob(tokenParts[1]));

    // Get the expiration time from the payload
    const expirationTime = payload.exp;

    // Calculate the remaining time in seconds until the token expires
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = expirationTime - currentTime;

    console.log(`The access token will expire in ${remainingTime} seconds.`);
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/blog/list/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                if (response.status === 401) {
                    console.log("token expired and expired time is", remainingTime);

                    // Access token has expired, use refresh token to get a new access token
                    const refreshResponse = await fetch("http://localhost:8000/api/refresh/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            refresh: localStorage.getItem("refreshToken"),
                        }),
                    });

                    if (refreshResponse.ok) {
                        const tokens = await refreshResponse.json();
                        localStorage.setItem("accessToken", tokens.access);
                        // Try fetching blogs again with the new access token
                        const newResponse = await fetch("http://localhost:8000/api/blog/list/", {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                            },
                        });
                        const data = await newResponse.json();
                        setBlogs(data);
                        setLoading(false);
                    } else {
                        throw new Error("Refresh token is invalid");
                    }
                } else {
                    const data = await response.json();
                    setBlogs(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchBlogs();
    }, []);

    const handleCreate = () => {
        const newBlog = {
            title: newBlogTitle,
            content: newBlogContent,
            authorName: newBlogAuthorName,
            image: newBlogImage, // Add the image file to the new blog object
        };

        const formData = new FormData();
        formData.append("title", newBlog.title);
        formData.append("content", newBlog.content);
        formData.append("authorName", newBlog.authorName);
        if(newBlogImage != null){
            formData.append('image', newBlogImage);
        }

        fetch("http://localhost:8000/api/blog/create/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formData, // Use the form data instead of JSON.stringify
        })
            .then((response) => response.json())
            .then((data) => {
                setBlogs([...blogs, data]);
                setNewBlogTitle("");
                setNewBlogContent("");
                setNewBlogAuthorName("");
                setNewBlogImage(null); // Reset the image state after submitting the form
            });
    };

  const navigate = useNavigate();

  const  handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
    // Remove access token and refresh token from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Navigate to the login page
  
    navigate('/login');
  } }

    if (loading) {
        return <span class="loader"></span>
    }

    return (

      

        <div style={{margin: "0px" ,width: "auto"}}> 

        <button onClick={handleLogout}>Logout</button>

        <div style={{ position: "auto"}}>
        

        <h2>Create New Blog</h2>
                    <label>
                        Title: </label><br></br>
                        <input type="text" value={newBlogTitle} onChange={(event) => setNewBlogTitle(event.target.value)} />
                   
                    <br />
                    <label>
                        Content: </label> <br></br>
                        <textarea value={newBlogContent} onChange={(event) => setNewBlogContent(event.target.value)} />
                   
                    <br />
                    <label>
                        Author Name:    </label>  <br></br>
                        <input type="text" value={newBlogAuthorName} onChange={(event) => setNewBlogAuthorName(event.target.value)} />
                 

                    <div>
                        <label htmlFor="newBlogImage">Image:</label> 
                        <input style={{backgroundColor: "transparent"}} type="file" id="newBlogImage" name="newBlogImage" onChange={(event) => setNewBlogImage(event.target.files[0])} />
                    </div>
                    <button  className="create" onClick={handleCreate}>Create Blog</button>
                    </div>
        </div>
    );
}
export default Create;
