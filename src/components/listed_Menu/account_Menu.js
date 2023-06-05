import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { deepOrange, deepPurple } from "@mui/material/colors";

export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [blogs, setBlogs] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [newBlogTitle, setNewBlogTitle] = useState("");
    const [newBlogContent, setNewBlogContent] = useState("");
    const [newBlogAuthorName, setNewBlogAuthorName] = useState("");

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
                        console.log(data);
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

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            // Remove access token and refresh token from local storage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // Navigate to the login page

            navigate("/login");
        }
    };

    return (
        <React.Fragment>
            {user && (
                <React.Fragment>
                    {/* <Typography variant="subtitle1">Username: {user.username}</Typography>
        <Typography variant="subtitle2">Email: {user.email}</Typography> */}
                    {/* Add more user data mappings here */}

                    <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                        <Tooltip title="Account settings">
                            <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }} aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined}>
                                <Avatar sx={{ bgcolor: deepOrange[500], width: 60, height: 60 }}>
                                    {" "}
                                    <span style={{ fontSize: "16px" }}> {user.username} </span>
                                    {/*   {user.username.charAt(0).toUpperCase()} */}{" "}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: "visible",
                                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                mt: 1.5,
                                "& .MuiAvatar-root": {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                "&:before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: "background.paper",
                                    transform: "translateY(-50%) rotate(45deg)",
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                        <MenuItem onClick={handleClose}>
                            <Avatar /> <Link to={`/profile/${user.id}`}> Profile </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Avatar />
                            <Link to={`/signup/`}> Create a New Account </Link>
                        </MenuItem>
                        <Divider />

                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}
