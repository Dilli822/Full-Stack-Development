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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": {
                width: "20ch",
            },
        },
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function Blog() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [successMessage, setSuccessMessage] = useState("");
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
            } catch (error) {
                console.error(error);
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
            image: newBlogImage, // Add the image file to the new blog object
        };

        const formData = new FormData();
        formData.append("title", newBlog.title);
        formData.append("content", newBlog.content);
        formData.append("authorName", newBlog.authorName);
        if (newBlogImage != null) {
            formData.append("image", newBlogImage);
        }

        try {
            const response = await fetch("http://localhost:8000/api/blog/create/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: formData, // Use the form data instead of JSON.stringify
            });

            const data = await response.json();

            setBlogs([...blogs, data]);
            setNewBlogTitle("");
            setNewBlogContent("");
            setNewBlogAuthorName("");
            setNewBlogImage(null); // Reset the image state after submitting the form
            setSuccessMessage("Post/Blog Created successfully!");

            // Switch to the NewsFeed tab after 10 seconds
            setTimeout(() => {
                setSuccessMessage("");
                setValue(0);
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    };

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
        };

        const formData = new FormData();
        formData.append("title", updatedBlog.title);
        formData.append("content", updatedBlog.content);
        formData.append("authorName", updatedBlog.authorName);
        if (updatedBlogImage != null) {
            formData.append("image", updatedBlogImage);
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

    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            // Remove access token and refresh token from local storage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // Navigate to the login page

            navigate("/login");
        }
    };

    if (loading) {
        return <span class="loader"></span>;
    }

    return (
        <div>
            <Container maxWidth="auto" style={{ height: "auto", position: "relative" }}>
                <div style={{ position: "sticky", top: "0", width: "100%", zIndex: "99" }}>
                    <div style={{ padding: "15px", backgroundColor: "#FFF" }}>
                        <div class="row">
                            <div class="col-3">
                                {/* <h3> {username}</h3>
                 <h4>{userId} </h4> */}
                                <AccountMenu />
                            </div>

                            <div class="col-5">
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="NewsFeed" {...a11yProps(0)} />
                                    <Tab label="Edit / Delete" {...a11yProps(1)} />
                                    <Tab label="Create/Add New" {...a11yProps(2)} />
                                </Tabs>

                                {successMessage && <div style={{ backgroundColor: "green", color: "white" }}>{successMessage}</div>}
                            </div>
                            <div class="col-4">
                                <div>
                                    <SearchAppBar />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ minHeight: "100vh", width: "100%" }}>
                    <div style={{ padding: "0px", backgroundColor: "#FFf" }}>
                        <div class="row">
                            <div class="col-3">
                                <div style={{ position: "fixed" }}>
                                    <SemesterNestedList />
                                </div>
                            </div>
                            <div class="col-5">
                                <Box sx={{ borderBottom: 1, borderColor: "divider" }}></Box>

                                <TabPanel value={value} index={0}>
                                  
                                    <Likes />
                                </TabPanel>
                                <TabPanel value={value} index={1} style={{}}>
                                   <h3> Update/Delete Blog</h3>
                                    {/* <UpdateBlog/> */}
                                    {selectedBlogId !== "" && (
                                        <div style={{ width: "auto" }}>
                                            <h5>Update/Delete For Blogs - "{blogs.find((blog) => blog.id === selectedBlogId).title}"</h5>
                                            <div>
                                                <label htmlFor="blog-title">Title:</label> <br></br>
                                                <input
                                                    style={{ width: "100%" }}
                                                    type="text"
                                                    id="blog-title"
                                                    value={updatedBlogTitle === undefined ? blogs.find((blog) => blog.id === selectedBlogId).title : updatedBlogTitle}
                                                    onChange={(e) => setUpdatedBlogTitle(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="blog-content">Content:</label> <br></br>
                                                <textarea
                                                    style={{ width: "100%" }}
                                                    id="blog-content"
                                                    value={updatedBlogContent === undefined ? blogs.find((blog) => blog.id === selectedBlogId).content : updatedBlogContent}
                                                    onChange={(e) => setUpdatedBlogContent(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="blog-author-name">Author Name:</label> <br></br>
                                                <input
                                                    style={{ width: "100%" }}
                                                    type="text"
                                                    id="blog-author-name"
                                                    value={updatedBlogAuthorName === undefined ? blogs.find((blog) => blog.id === selectedBlogId).authorName : updatedBlogAuthorName}
                                                    onChange={(e) => setUpdatedBlogAuthorName(e.target.value)}
                                                />
                                            </div>
                                            <br></br>
                                            <div>
                                                <label htmlFor="updatedBlogImage">Image:</label>
                                                <img src={`http://localhost:8000${blogs.find((blog) => blog.id === selectedBlogId).image}`} style={{ width: "75px", maxWidth: "100%" }} />
                                                <br></br>
                                                <input style={{ backgroundColor: "transparent" }} type="file" id="updatedBlogImage" name="updatedBlogImage" onChange={(event) => setUpdatedBlogImage(event.target.files[0])} />
                                            </div>
                                            <br></br>
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
                                                .filter((blog) => blog.author_id === userId) // filter blogs by author id
                                                .map((blog) => (
                                                    <div key={blog.id}>
                                                        <h2>{blog.title}</h2>
                                                        <img src={`http://localhost:8000${blog.image}`} style={{ width: "100%", maxWidth: "100%" }} />
                                                        <p>{blog.content}</p>
                                                        <p>Author: {blog.authorName}</p>
                                                        <p>Published Date: {blog.created_at}</p>
                                                        <p>Updated Date: {blog.updated_at}</p>
                                                        {created_at && <p>Blog Created at Standard: {created_at}</p>}
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
                                </TabPanel>
                                <TabPanel value={value} index={2} style={{ height: "100vh" }}>
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
                                    <br></br>
                                    <button className="create" onClick={handleCreate}>
                                        Create Blog
                                    </button>
                                </TabPanel>
                            </div>
                            <div class="col-4">
                                <div style={{ position: "fixed" }}>
                                    <PastNestedList />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            <footer style={{ background: "#000", color: "#fff" }}>footer</footer>
        </div>
    );
}

export default Blog;
