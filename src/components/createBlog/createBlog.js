
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import AccountMenu from "../listed_Menu/account_Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import PastNestedList from "../listed_Menu/past_menu_list";
import SemesterNestedList from "../listed_Menu/semester_subject_menu";
import SearchAppBar from "../searching/top_menu_search";
import Likes from "../likes/blog_Likes";
import zIndex from "@mui/material/styles/zIndex";

export default function CreateBlog(){


    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [videoLoading, setVideoLoading] = useState(true);

    const [mainLoading, setMainLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [newBlogTitle, setNewBlogTitle] = useState("");
    const [newBlogContent, setNewBlogContent] = useState("");
    const [newBlogAuthorName, setNewBlogAuthorName] = useState("");

    const [newBlogVideo, setNewBlogVideo] = useState(null);

    const [blogs, setBlogs] = useState([]);
    const [selectedBlogId, setSelectedBlogId] = useState("");
    const [updatedBlogTitle, setUpdatedBlogTitle] = useState(undefined);
    const [updatedBlogContent, setUpdatedBlogContent] = useState(undefined);
    const [updatedBlogAuthorName, setUpdatedBlogAuthorName] = useState(undefined);

    const [newBlogImage, setNewBlogImage] = useState(null);
    const [updatedBlogImage, setUpdatedBlogImage] = useState(null);
    const [user, setUser] = useState("");
    const [imageUrl, setImageUrl] = useState(null);

    const [authorId, setAuthorId] = useState("");
    const [userId, setUserId] = useState("");

    const [created_at, setCreatedAt] = useState("");
    const accessToken = localStorage.getItem("accessToken");
    const tokenParts = accessToken.split(".");
    const [createdMsg, setCreatedMsg] = "";
    // const [blogLikes,setBlogLikes] = useState(0);
    const [blogLikes, setBlogLikes] = useState(0);

    // Decode the access token payload
    const payload = JSON.parse(atob(tokenParts[1]));

    // Get the expiration time from the payload
    const expirationTime = payload.exp;

    // Calculate the remaining time in seconds until the token expires
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = expirationTime - currentTime;

    const [updatedBlogVideo, setUpdatedBlogVideo] = useState(null);

    const [username, setUserName] = useState(null);

    const [countBlogLikes, setCountBlogLikes] = useState(0);

    const handleLikeClick = () => {
        if (blogLikes === 0) {
            setBlogLikes(blogLikes + 1); // Increase like count
        } else {
            setBlogLikes(blogLikes - 1); // Decrease like count
        }
    };

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
                        console.log("blog array data is --->", data);
                        setBlogs(data);
                        setAuthorId(data.author_id);
                        setCountBlogLikes(data.likes);
                        setMainLoading(false);
                        setLoading(false);
                    } else {
                        throw new Error("Refresh token is invalid");
                    }
                } else {
                    const data = await response.json();
                    console.log(data);
                    setBlogs(data);
                    setLoading(false);
                    
                }
            } catch (error) {
                console.error(error);
                setMainLoading(true);
            }
        };

        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/user/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                const data = await response.json();
                console.log(data);
                console.log(data.id);
                setUser(data);
                setUserId(data.id);
                setUserName(data.username);
                setMainLoading(false);
            } catch (error) {
                console.error(error);
                setMainLoading(true);
            }
        };
        fetchUser();

        fetchBlogs();
    }, []);


    const handleCreate = async () => {
        const newBlog = {
          title: newBlogTitle,
          content: newBlogContent,
          authorName: newBlogAuthorName,
          image: newBlogImage,
          video: newBlogVideo, // Add the video file to the new blog object
        };
      
        const formData = new FormData();
        formData.append("title", newBlog.title);
        formData.append("content", newBlog.content);
        formData.append("authorName", newBlog.authorName);
        if (newBlogImage !== null) {
          formData.append("image", newBlogImage);
        }
        if (newBlogVideo !== null) {
          formData.append("video", newBlogVideo);
        }
      
        try {
          const response = await fetch("http://localhost:8000/api/blog/create/", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formData,
          });
      
          const data = await response.json();
      
          setBlogs([...blogs, data]);
          setNewBlogTitle("");
          setNewBlogContent("");
          setNewBlogAuthorName("");
          setNewBlogImage(null);
          setNewBlogVideo(null);
          setSuccessMessage("Post/Blog Created successfully!");
      
          setTimeout(() => {
            setSuccessMessage("");
            setValue(0);
          }, 2000);
        } catch (error) {
          console.error(error);
        }
      };
      

    return(
        <div>

    <div>
        <h3>Create/Add New Blog</h3>{" "}
    </div>
    <label>Title: </label>
    <br></br>
    <input style={{ width: "100%" }} type="text" value={newBlogTitle} onChange={(event) => setNewBlogTitle(event.target.value)} />
    <br />
    <label>Content: </label> <br></br>
    <textarea style={{ width: "100%", border: "1px solid #dee0e2", height: "auto", minHeight: "35vh" }} value={newBlogContent} onChange={(event) => setNewBlogContent(event.target.value)} />
    <br />
    <label>Author Name: </label> <br></br>
    <input style={{ width: "100%" }} type="text" value={newBlogAuthorName} onChange={(event) => setNewBlogAuthorName(event.target.value)} />
    <div>
        <span> *Please Only Upload Valid Format </span>
        <label htmlFor="newBlogImage">Image * .jpg, .png, .jpeg</label>
        <input style={{ backgroundColor: "transparent", width: "100%" }} type="file" id="newBlogImage" name="newBlogImage" onChange={(event) => setNewBlogImage(event.target.files[0])} />
    </div>

    <div>
<span>*Please Only Upload Valid Format</span>
<label htmlFor="newBlogVideo">Video * .mp4, .mov, .avi</label>
<input
style={{ backgroundColor: "transparent", width: "100%" }}
type="file"
id="newBlogVideo"
name="newBlogVideo"
onChange={(event) => setNewBlogVideo(event.target.files[0])}
/>
</div>
<br />

    <br></br>
    <button className="create" onClick={handleCreate}>
        Create Blog
    </button>


        </div>
    )
}