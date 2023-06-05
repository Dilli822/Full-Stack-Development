import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Update from "./update";
import Create from "./create";
import Logout from "./logout";
import ImageUploader from "./storeImagetemporarily";
import Login from "../account/login";
import { useNavigate } from 'react-router-dom';

function UpdateBlog() {
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
    
    const handleUpdate = () => {
        const updatedBlog = {
            id: selectedBlogId,
            title: updatedBlogTitle === undefined ? blogs.find((blog) => blog.id === selectedBlogId).title : updatedBlogTitle,
            content: updatedBlogContent === undefined ? blogs.find((blog) => blog.id === selectedBlogId).content : updatedBlogContent,
            authorName: updatedBlogAuthorName === undefined ? blogs.find((blog) => blog.id === selectedBlogId).authorName : updatedBlogAuthorName,
        };

        const formData = new FormData();
        formData.append("title", updatedBlog.title);
        formData.append("content", updatedBlog.content);
        formData.append("authorName", updatedBlog.authorName);
        if(updatedBlogImage != null){
            formData.append('image', updatedBlogImage);
        }

        fetch(`http://localhost:8000/api/blog/update/${updatedBlog.id}/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                const index = blogs.findIndex((blog) => blog.id === data.id);
                const newBlogs = [...blogs];
                newBlogs[index] = data;
                setBlogs(newBlogs);
                setSelectedBlogId("");
                setUpdatedBlogTitle(undefined);
                setUpdatedBlogContent(undefined);
                setUpdatedBlogAuthorName(undefined);
                setUpdatedBlogImage(null);
            })
            .catch((error) => console.error(error));
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

        <div>


        <div style={{ display: "flex", justifyContent: "space-around" , flexWrap: "wrap-reverse" , width: "100%", padding: "0 55px", margin: "0 35px"}}>

        <div style={{ margin: "0px", width: "auto"}}>
  

        <button onClick={handleLogout}>Logout</button>
        <div style={{ position: "auto"}}>



                                    {/* <UpdateBlog/> */}
                {selectedBlogId !== "" && (
                    <div style={{ width: "auto"}}>
                        <h2>Update Blog "{blogs.find((blog) => blog.id === selectedBlogId).title}"</h2>

                        <div>
                            <label htmlFor="blog-title">Title:</label> <br></br>
                            <input type="text" id="blog-title" value={updatedBlogTitle === undefined ? blogs.find((blog) => blog.id === selectedBlogId).title : updatedBlogTitle} onChange={(e) => setUpdatedBlogTitle(e.target.value)} />
                        </div>

                        <div>
                            <label htmlFor="blog-content">Content:</label> <br></br>
                            <textarea id="blog-content" value={updatedBlogContent === undefined ? blogs.find((blog) => blog.id === selectedBlogId).content : updatedBlogContent} onChange={(e) => setUpdatedBlogContent(e.target.value)} />
                        </div>

                        <div>
                            <label htmlFor="blog-author-name">Author Name:</label> <br></br>
                            <input
                                type="text"
                                id="blog-author-name"
                                value={updatedBlogAuthorName === undefined ? blogs.find((blog) => blog.id === selectedBlogId).authorName : updatedBlogAuthorName}
                                onChange={(e) => setUpdatedBlogAuthorName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="updatedBlogImage">Image:</label>
                            <img src={`http://localhost:8000${blogs.find((blog) => blog.id === selectedBlogId).image}`} style={{ width: "50px", maxWidth: "100%" }} />
                            <input style={{backgroundColor: "transparent"}} type="file" id="updatedBlogImage" name="updatedBlogImage" onChange={(event) => setUpdatedBlogImage(event.target.files[0])} />
                        </div>
                    

                        <button className="update"  onClick={handleUpdate}>Update Blog</button>
                        <button className="cancel" onClick={() => setSelectedBlogId("")}>Cancel</button>
                    </div>
                )}

               
        </div>
        
        </div>
        </div>
        </div>
    );
}
export default UpdateBlog;