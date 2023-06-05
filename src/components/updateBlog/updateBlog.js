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

export default function UpdateBlog() {
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
                const response = await fetch("http://localhost:8000/api/blog/lists/", {
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
                        const newResponse = await fetch("http://localhost:8000/api/blog/lists/", {
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

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            fetch(`http://localhost:8000/api/blog/delete/${id}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        setBlogs(blogs.filter((blog) => blog.id !== id));
                    } else {
                        throw new Error("Delete failed");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const handleUpdate = () => {
        const updatedBlog = {
            id: selectedBlogId,
            title: updatedBlogTitle === undefined ? blogs.find((blog) => blog.id === selectedBlogId).title : updatedBlogTitle,
            content: updatedBlogContent === undefined ? blogs.find((blog) => blog.id === selectedBlogId).content : updatedBlogContent,
            authorName: updatedBlogAuthorName === undefined ? blogs.find((blog) => blog.id === selectedBlogId).authorName : updatedBlogAuthorName,
            video: updatedBlogVideo,
        };

        const formData = new FormData();
        formData.append("title", updatedBlog.title);
        formData.append("content", updatedBlog.content);
        formData.append("authorName", updatedBlog.authorName);
        if (updatedBlogImage != null) {
            formData.append("image", updatedBlogImage);
        }
        if (updatedBlogVideo !== null) {
            formData.append("video", updatedBlogVideo);
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

                // Switch to the NewsFeed tab after 10 seconds
                setSuccessMessage("Post/Blog Updated successfully!");

                setTimeout(() => {
                    setSuccessMessage("");
                    setValue(1);
                }, 1500);
            })
            .catch((error) => console.error(error));
    };

    return (
        <div>
            {mainLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h3>Update/Delete Blog</h3>
                    <hr></hr>
                    {selectedBlogId !== "" && (
                        <div style={{ width: "auto" }}>
                            <h5>Update/Delete For Blogs - "{blogs.find((blog) => blog.id === selectedBlogId).title}"</h5>
                            <div>
                                <label htmlFor="blog-title">Title:</label> <br />
                                <input
                                    style={{ width: "100%" }}
                                    type="text"
                                    id="blog-title"
                                    value={updatedBlogTitle === undefined ? blogs.find((blog) => blog.id === selectedBlogId).title : updatedBlogTitle}
                                    onChange={(e) => setUpdatedBlogTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="blog-content">Content:</label> <br />
                                <textarea
                                    style={{ width: "100%", minHeight: "300px" }}
                                    id="blog-content"
                                    value={updatedBlogContent === undefined ? blogs.find((blog) => blog.id === selectedBlogId).content : updatedBlogContent}
                                    onChange={(e) => setUpdatedBlogContent(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="blog-author-name">Author Name:</label> <br />
                                <input
                                    style={{ width: "100%" }}
                                    type="text"
                                    id="blog-author-name"
                                    value={updatedBlogAuthorName === undefined ? blogs.find((blog) => blog.id === selectedBlogId).authorName : updatedBlogAuthorName}
                                    onChange={(e) => setUpdatedBlogAuthorName(e.target.value)}
                                />
                            </div>
                            <br />
                            <div>
                                <label htmlFor="updatedBlogImage">Image:</label>
                                <img src={`http://localhost:8000${blogs.find((blog) => blog.id === selectedBlogId).image}`} style={{ width: "75px", maxWidth: "100%" }} alt="Blog Image" />
                                <br />
                                <input style={{ backgroundColor: "transparent" }} type="file" id="updatedBlogImage" name="updatedBlogImage" onChange={(event) => setUpdatedBlogImage(event.target.files[0])} />
                            </div>
                            <br />
                            <div>
                                <label htmlFor="updatedBlogVideo">Video:</label>
                                {blogs.find((blog) => blog.id === selectedBlogId).video ? (
                                    <video src={`http://localhost:8000${blogs.find((blog) => blog.id === selectedBlogId).video}`} style={{ width: "100%" }} controls loop>
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <p>No video available</p>
                                )}
                                <br />
                                <input style={{ backgroundColor: "transparent" }} type="file" id="updatedBlogVideo" name="updatedBlogVideo" onChange={(event) => setUpdatedBlogVideo(event.target.files[0])} />
                            </div>
                            <br />
                            <button className="update" onClick={handleUpdate}>
                                Update Blog
                            </button>{" "}
                            &nbsp;
                            <button className="cancel" onClick={() => setSelectedBlogId("")}>
                                Cancel
                            </button>
                        </div>
                    )}

                    {selectedBlogId == "" && (
                        <div>
                            {blogs
                                .sort((a, b) => b.id - a.id)
                                .filter((blog) => blog.author_id === userId) // filter blogs by author id
                                .map((blog) => (
                                    <div key={blog.id}>
                                        <div>
                                            <h2> Title: {blog.title}</h2>

                                            <img src={`http://localhost:8000${blog.image}`} style={{ width: "100%", maxWidth: "100%" }} />
                                            <br></br>
                                            <p style={{ marginTop: "15px", fontSize: "17px", height: "100px", overflow: "auto" }}>{blog.content}</p>
                                            <p>Author: {blog.authorName}</p>
                                            <p>Published Date: {blog.created_at}</p>
                                            <p>Updated Date: {blog.updated_at}</p>
                                            {created_at && <p>Blog Created at Standard: {created_at}</p>}
                                        </div>
                                        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setSelectedBlogId(blog.id)}>
                                            Edit
                                        </Button>{" "}
                                        &nbsp;
                                        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(blog.id)}>
                                            {" "}
                                            Delete{" "}
                                        </Button>
                                        <hr></hr>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
