import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from "@mui/icons-material/Comment";
import { BrowserRouter as Router, Switch, Route ,Link } from "react-router-dom";
//import SharePost from "../sharePost/sharePost";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


import Comments from "../comments/comments";

function Likes() {
  const [blogs, setBlogs] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState([]);
  const [comments, setComments] = useState([]);

  const [anchorEls, setAnchorEls] = useState(new Array(blogs.length).fill(null));
  const [shareUrls, setShareUrls] = useState(new Array(blogs.length).fill(""));
  const [copiedStates, setCopiedStates] = useState(new Array(blogs.length).fill(false));

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(new Array(blogs.length).fill(false)); // Reset copiedStates to all false
    setCopiedStates(copiedStates.map((state, index) => (index === copiedStates.indexOf(true) ? true : state))); // Set only the currently copied share button's copied state to true
  };

  const cancelCopy = () => {
    setCopiedStates(new Array(blogs.length).fill(false));
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
     
          };
        });

        setBlogs(blogLikes);
        setLikes(blogLikes.map((blog) => blog.likes));
        setLiked(blogLikes.map((blog) => blog.liked_state));

        console.log(blogLikes); 
        setShareUrls(blogLikes.map((blog) => `${window.location.origin}/blog/${blog.id}`));
      } catch (error) {
        console.error(error);
      }
    };

    fetchLikes();
  }, []);
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/blog/comments/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    
      });
      if (response.ok) {
        const data = await response.json();
        console.log("comments are ", data);
        setComments(data);

      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error:', error);
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
      } else {
        console.error("Error updating like state");
      }
    } catch (error) {
      console.error(error);
    }

  
  };


  
      


  return (
    <div>
    {blogs.map((blog, index) => (
    <div key={blog.id}>
     
    <h2>Title: {blog.title}</h2>
    <h3>Blog Id: {blog.id}</h3>
  
          <img src={`http://localhost:8000${blog.image}`} style={{ width: "450px", maxWidth: "100%" }} />
          <div style={{ height: "200px", overflow: "hidden"}}> 
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
<p>{likes[index]} Likes</p>
          <IconButton onClick={() => handleLike(blog.id, blog.liked_state, index)}>
            {liked[index] ? <FavoriteIcon color="error" style={{ width:"30px",height:"30px"}}/> : <FavoriteIcon color="black"  style={{ width:"30px",height:"30px"}}/>}
          </IconButton>

          <IconButton
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
  {copiedStates[index] && (
    <Typography sx={{ p: 2 }}>Link copied to clipboard!</Typography>
  )}
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
      ))}

      <Comments/>

      
    </div>
    );
    }

export default Likes;



import React, { useEffect, useState } from 'react';
import { IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from "@mui/icons-material/Comment";
import { BrowserRouter as Router, Switch, Route ,Link } from "react-router-dom";
//import SharePost from "../sharePost/sharePost";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Likes = () => {
  const [blogs, setBlogs] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState([]);
  const [comments, setComments] = useState([]);

  const [anchorEls, setAnchorEls] = useState(new Array(blogs.length).fill(null));
  const [shareUrls, setShareUrls] = useState(new Array(blogs.length).fill(""));
  const [copiedStates, setCopiedStates] = useState(new Array(blogs.length).fill(false));

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(new Array(blogs.length).fill(false)); // Reset copiedStates to all false
    setCopiedStates(copiedStates.map((state, index) => (index === copiedStates.indexOf(true) ? true : state))); // Set only the currently copied share button's copied state to true
  };

  const cancelCopy = () => {
    setCopiedStates(new Array(blogs.length).fill(false));
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
     
          };
        });

        setBlogs(blogLikes);
        setLikes(blogLikes.map((blog) => blog.likes));
        setLiked(blogLikes.map((blog) => blog.liked_state));

        console.log(blogLikes); 
        setShareUrls(blogLikes.map((blog) => `${window.location.origin}/blog/${blog.id}`));
      } catch (error) {
        console.error(error);
      }
    };

    fetchLikes();
  }, []);
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/blog/comments/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    
      });
      if (response.ok) {
        const data = await response.json();
        console.log("comments are ", data);
        setComments(data);

      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error:', error);
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
      } else {
        console.error("Error updating like state");
      }
    } catch (error) {
      console.error(error);
    }

  
  };

  useEffect(() => {
    const fetchBlogsAndComments = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/blog-comments/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBlogs(data.blogs);
          setComments(data.comments);
        } else {
          console.error('Failed to fetch blogs and comments');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlogsAndComments();
  }, []);

  return (
    <div>
      {/* {blogs.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
          <p>Author: {blog.authorName}</p>
          <p>Likes: {blog.likes}</p>
          <h3>Comments:</h3>

        </div>
      ))} */}

      <div>
      {blogs.map((blog, index) => (
    <div key={blog.id}>
     
    <h2>Title: {blog.title}</h2>
    <h3>Blog Id: {blog.id}</h3>
  
          <img src={`http://localhost:8000${blog.image}`} style={{ width: "450px", maxWidth: "100%" }} />
          <div style={{ height: "200px", overflow: "hidden"}}> 
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
<h5>Comments:{blog.total_comments} </h5>
<h5>{likes[index]} Likes</h5>
          <IconButton onClick={() => handleLike(blog.id, blog.liked_state, index)}>
            {liked[index] ? <FavoriteIcon color="error" style={{ width:"30px",height:"30px"}}/> : <FavoriteIcon color="black"  style={{ width:"30px",height:"30px"}}/>}
          </IconButton>

          <IconButton
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
  {copiedStates[index] && (
    <Typography sx={{ p: 2 }}>Link copied to clipboard!</Typography>
  )}
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

{comments
            .filter((comment) => comment.blog == blog.id)
            .map((comment) => (
              <div key={comment.id}>
                <p>Comment by: {comment.author}</p>
                <p>{comment.comment_content}</p>
              
              </div>
            ))}

        </div>
      ))}
      </div>
    </div>
  );
};

export default Likes;
