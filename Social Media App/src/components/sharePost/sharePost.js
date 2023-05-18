import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from "@mui/icons-material/Comment";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function SharePost() {
    const [blogs, setBlogs] = useState([]);
    const [anchorEls, setAnchorEls] = useState(new Array(blogs.length).fill(null));
    const [shareUrls, setShareUrls] = useState(new Array(blogs.length).fill(""));
    const [copiedStates, setCopiedStates] = useState(new Array(blogs.length).fill(false));
  
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
      setCopiedStates(new Array(blogs.length).fill(false));
      setCopiedStates(copiedStates.map((state, index) => (index === copiedStates.indexOf(true) ? true : state)));
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
        setShareUrls(blogLikes.map((blog) => `${window.location.origin}/blog/${blog.id}`));
        console.log(blogLikes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLikes();
  }, []);

  return (
    <div>
   {blogs.length > 0 && blogs.map((blog, index) => (
      <div key={blog.id}>
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
        <IconButton>
          <FavoriteIcon color="error" style={{ width: "30px", height: "30px" }} />
        </IconButton>
     
      </div>
    ))}
  </div>
  )}  
            export default SharePost;