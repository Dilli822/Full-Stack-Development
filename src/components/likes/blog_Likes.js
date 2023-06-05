// import React, { useEffect, useState } from "react";
// import { IconButton } from "@mui/material";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import ShareIcon from "@mui/icons-material/Share";
// import CommentIcon from "@mui/icons-material/Comment";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import Popover from "@mui/material/Popover";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import { maxHeight } from "@mui/system";
// import Comments from "../comments/comments";

// const Likes = () => {
//     const [blogs, setBlogs] = useState([]);
//     const [likes, setLikes] = useState([]);
//     const [liked, setLiked] = useState([]);
//     const [comments, setComments] = useState([]);

//     const [anchorEls, setAnchorEls] = useState(new Array(blogs.length).fill(null));
//     const [shareUrls, setShareUrls] = useState(new Array(blogs.length).fill(""));
//     const [copiedStates, setCopiedStates] = useState(new Array(blogs.length).fill(false));
//     const [videoLoading, setVideoLoading] = useState(true);

//     const [mainLoading, setMainLoading] = useState(false);

//     const copyToClipboard = (text) => {
//         navigator.clipboard.writeText(text);
//         setCopiedStates(new Array(blogs.length).fill(false)); // Reset copiedStates to all false
//         setCopiedStates(copiedStates.map((state, index) => (index === copiedStates.indexOf(true) ? true : state))); // Set only the currently copied share button's copied state to true
//     };

//     const cancelCopy = () => {
//         setCopiedStates(new Array(blogs.length).fill(false));
//     };

//     useEffect(() => {
//         const fetchLikes = async () => {
//             try {
//                 const response = await fetch("http://localhost:8000/api/blog/likes/", {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                     },
//                 });
                
                

//                 const data = await response.json();
//                 const blogLikes = data.map((blog) => {
//                     return {
//                         id: blog.id,
//                         likes: blog.likes,
//                         liked_state: blog.liked_state,
//                         title: blog.title,
//                         image: blog.image,
//                         content: blog.content,
//                         authorName: blog.authorName,
//                         created_at: blog.created_at,
//                         updated_at: blog.updated_at,
//                         total_comments: blog.total_comments,
//                     };
//                 });

//                 setBlogs(blogLikes);
//                 setLikes(blogLikes.map((blog) => blog.likes));
//                 setLiked(blogLikes.map((blog) => blog.liked_state));
//                 setMainLoading(false); 
//                 console.log("blog likes with totsl commenets ", blogLikes);
//                 setShareUrls(blogLikes.map((blog) => `${window.location.origin}/blog/${blog.id}`));
//             } 
            
            

            
//             catch (error) {
//                 setMainLoading(true); 
//                 console.error(error);
//             }
//         };


        

//         fetchLikes();
//     }, []);
//     useEffect(() => {
//         fetchComments();
//     }, []);

//     const fetchComments = async () => {
//         try {
//             const response = await fetch("http://localhost:8000/api/blog/comments/", {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                 },
//             });
//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("comments are ", data);
//                 setComments(data);
//             } else {
//                 console.error("Failed to fetch comments");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     };
//     const handleLike = async (blogId, currentLikedState, index) => {
//         try {
//             const response = await fetch(`http://localhost:8000/api/blog/likes/update/${blogId}/`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                 },
//                 body: JSON.stringify({ liked: !currentLikedState }),
//             });

//             if (response.ok) {
//                 // update liked state for the current blog
//                 const updatedBlogLikes = [...blogs];
//                 updatedBlogLikes[index].liked_state = !currentLikedState;
//                 if (currentLikedState) {
//                     updatedBlogLikes[index].likes--;
//                 } else {
//                     updatedBlogLikes[index].likes++;
//                 }
//                 setBlogs(updatedBlogLikes);

//                 // update total likes count
//                 const updatedLikes = [...likes];
//                 if (currentLikedState) {
//                     updatedLikes[index]--;
//                 } else {
//                     updatedLikes[index]++;
//                 }
//                 setLikes(updatedLikes);

//                 // update liked state
//                 const updatedLiked = [...liked];
//                 updatedLiked[index] = !currentLikedState;
//                 setLiked(updatedLiked);
//             } else {
//                 console.error("Error updating like state");
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     function playVideo(videoId) {
//     const video = document.getElementById(videoId);
//     video.play();
// }

// function pauseVideo(videoId) {
//     const video = document.getElementById(videoId);
//     video.pause();
// }


//     useEffect(() => {
//         const fetchBlogsAndComments = async () => {
//             try {
//                 const response = await fetch("http://localhost:8000/api/blog-comments/", {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                     },
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     setBlogs(data.blogs);
//                     setComments(data.comments);
//                 } else {
//                     console.error("Failed to fetch blogs and comments");
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchBlogsAndComments();
//     }, []);


//     function playVideo(videoId) {
//         const video = document.getElementById(videoId);
//         video.play();
//     }
    
//     function pauseVideo(videoId) {
//         const video = document.getElementById(videoId);
//         video.pause();
//     }
    
//     return (
//         <div>
//         <div>
//           {mainLoading ? (
//             <p>Loading...</p>
//           ) : (
//             blogs
//               .sort((a, b) => b.id - a.id)
//               .map((blog, index) => (
//                 <div key={blog.id}>
//                   <h2>{blog.title}</h2>
//                   <h3>Blog Id: {blog.id}</h3>
  
//                   <div style={{ width: "100%", height: "100%" }}>
//                     <img
//                       src={`http://localhost:8000${blog.image}`}
//                       style={{ width: "100%", maxWidth: "100%" }}
//                       alt="Blog Image"
//                     />
//                   </div>
//                   <br />
  
//                   {blog.video ? (
//                     <div>
//                       <video
//                         controls
//                         style={{ maxWidth: "100%" }}
//                         onLoad={() => console.log("Video loaded")}
//                         onError={() => console.log("Video loading error")}
//                       >
//                         <source src={`http://localhost:8000${blog.video}`} type="video/mp4" />
//                         Your browser does not support the video tag.
//                       </video>
//                       {/* Add video loading state check here */}
//                       {videoLoading && <p>Loading...</p>}
//                     </div>
//                   ) : (
//                     <p>Loading...</p>
//                   )}
  
//                   <div></div>
  
//                   <div style={{ height: "200px", overflow: "hidden" }}>
//                     <p>{blog.content}</p>
//                     <p>Author: {blog.authorName}</p>
//                     <p>Published Date: {blog.created_at}</p>
//                     <p>Updated Date: {blog.updated_at}</p>
//                     <br />
//                   </div>
//                   {/* ... */}

                
//                 </div>
//               ))
            
//           )}
  
          
//         </div>
//       </div>
//     )
// };


// export default Likessa;
