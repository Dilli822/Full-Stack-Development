import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
//import SharePost from "../sharePost/sharePost";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel styles
import { Carousel } from "react-responsive-carousel"; // Import the Carousel component
import { ChatBubbleOutline } from '@material-ui/icons';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import MapsUgcRoundedIcon from '@mui/icons-material/MapsUgcRounded';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

// Inside your component

const Likes = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState([]);
    const [comments, setComments] = useState([]);

    const [anchorEls, setAnchorEls] = useState(new Array(blogs.length).fill(null));
    const [shareUrls, setShareUrls] = useState(new Array(blogs.length).fill(""));
    const [copiedStates, setCopiedStates] = useState(new Array(blogs.length).fill(false));
    const [videoLoading, setVideoLoading] = useState(true);
    const [mainLoading, setMainLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [openCommentModal, setOpenCommentModal] = useState(false);

    const handleCommentClick = (event) => {
      setOpenCommentModal(true);setAnchorEl(event.currentTarget);
    };
    
    const handleCommentClose = () => {
      setOpenCommentModal(false);  setAnchorEl(null);
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(new Array(blogs.length).fill(false)); // Reset copiedStates to all false
        setCopiedStates(copiedStates.map((state, index) => (index === copiedStates.indexOf(true) ? true : state))); // Set only the currently copied share button's copied state to true
    };

    const cancelCopy = () => {
        setCopiedStates(new Array(blogs.length).fill(false));
    };
    const fetchComments = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/blog/comments/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log("comments are ", data);
                setMainLoading(false);
                setComments(data);
            } else {
                console.error("Failed to fetch comments");
            }
        } catch (error) {
            console.error("Error:", error);
            setMainLoading(true);
        }
    };
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
                setMainLoading(false);

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
                setMainLoading(false);
            } else {
                console.error("Error updating like state");
            }
        } catch (error) {
            console.error(error);
            setMainLoading(true);
        }
    };

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
                        total_comments: blog.total_comments,
                        video: blog.video,
                    };
                });

                setBlogs(blogLikes);
                setMainLoading(false);
                setLikes(blogLikes.map((blog) => blog.likes));
                setLiked(blogLikes.map((blog) => blog.liked_state));

                console.log(blogLikes);
                setShareUrls(blogLikes.map((blog) => `${window.location.origin}/blog/${blog.id}`));
            } catch (error) {
                console.error(error);
                setMainLoading(true);
            }
        };

        fetchLikes();
    }, []);
    useEffect(() => {
        fetchComments();
    }, []);
    const popoverStyles = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '50%',
      // Set the desired width
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    };
    
    const backdropStyles = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    };
    

    return (
        <div>
            {mainLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {/* .sort((a, b) => b.id - a.id) */}
                    {blogs.map((blog, index) => (
                        <div key={blog.id}>
     <h2>Title: {blog.title}</h2>
                            <h3>Blog Id: {blog.id}</h3>
<Carousel showThumbs={false}>
                {blog.image && <img style={{ maxWidth: "100%"}} src={`http://localhost:8000${blog.image}`} alt="Image" />}
                {blog.video && (
                  <video controls style={{ maxWidth: "100%"}}>
                    <source src={`http://localhost:8000${blog.video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </Carousel>

                       

                            <div style={{ height: "", overflow: "hidden" }}>
                                <p>content: {blog.content}</p>
                                <p>Author: {blog.authorName}</p>
                                <p>Published Date: {blog.created_at}</p>
                                <p>Updated Date: {blog.updated_at}</p>





                                <br></br>
                            </div>
                            <Link to={`/blog/${blog.id}`}>
                                <div key={blog.id}>
                                    {/* ... */}
                                    View Detail.....
                                </div>
                            </Link>
                            <div style={{ display: "flex", alignItems: "center"}}>
                            
                            <IconButton onClick={() => handleLike(blog.id, blog.liked_state, index)}>
                                {liked[index] ? <FavoriteIcon color="error" style={{ width: "30px", height: "30px" }} /> : <FavoriteIcon color="black" style={{ width: "30px", height: "30px" }} />}
                            </IconButton>
                            comment
                            <IconButton onClick={handleCommentClick}>
    <MapsUgcRoundedIcon style={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 45 }} />
  </IconButton>



                            &nbsp; &nbsp;
                            Share<IconButton
                                aria-describedby={`popover-${index}`}
                                onClick={(event) => {
                                    const newAnchorEls = [...anchorEls];
                                    newAnchorEls[index] = event.currentTarget;
                                    setAnchorEls(newAnchorEls);
                                }}
                            >
                                <ShareIcon color="action" style={{ width: "30px", height: "30px" }} />
                            </IconButton>
                 


                            <Popover
                                open={Boolean(anchorEls[index])}
                                anchorEl={anchorEls[index]}
                                onClose={() => {
                                    const newAnchorEls = [...anchorEls];
                                    newAnchorEls[index] = null;
                                    setAnchorEls(newAnchorEls);
                                    setCopiedStates((prevState) => {
                                        let newState = [...prevState];
                                        newState[index] = false;
                                        return newState;
                                    });
                                    cancelCopy();
                                }}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                }}
                            >
                                {copiedStates[index] && <Typography sx={{ p: 2 }}>Link copied to clipboard!</Typography>}
                                <Typography sx={{ p: 2 }}>{shareUrls[index]}</Typography>
                                <Button
                                    variant="contained"
                                    disabled={copiedStates[index]}
                                    onClick={() => {
                                        copyToClipboard(shareUrls[index]);
                                        let newCopiedStates = [...copiedStates];
                                        newCopiedStates[index] = true;
                                        setCopiedStates(newCopiedStates);
                                    }}
                                >
                                    {copiedStates[index] ? "Copied" : "Copy"}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        const newAnchorEls = [...anchorEls];
                                        newAnchorEls[index] = null;
                                        setAnchorEls(newAnchorEls);
                                        setCopiedStates((prevState) => {
                                            let newState = [...prevState];
                                            newState[index] = false;
                                            return newState;
                                        });
                                        cancelCopy();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Popover>
                            </div>

                            <div style={{ display: "flex"}}>
                            <h5>{likes[index]} like</h5> &nbsp;&nbsp;&nbsp;
                            <h5>Comments:{blog.total_comments} </h5>
                              </div>

                              <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleCommentClose}
      disableScrollLock
      BackdropProps={{ style: backdropStyles }}
    >
      <div style={popoverStyles}>
        <IconButton onClick={handleCommentClose} style={{ position: 'absolute', top: '8px', right: '8px' }}>
          <CloseIcon />
        </IconButton>
        <hr></hr>
        <br></br>
       
        {comments
            .filter((comment) => comment.blog == blogs.id)
            .map((comment) => (
          <div key={comment.id == blog.id} style={{ border: "0px solid red", padding: "10px", width: "100%"}}>
     
             
            <Typography variant="subtitle1">Comment by: {comment.author}</Typography>
            <Typography variant="body1">{comment.comment_content}</Typography>
          </div>
        ))}
      </div>
    </Popover>
              

                                    <hr></hr>
                        </div>
                        
                    ))}

                </div>
            )}
        </div>
    );
};



export default Likes;
