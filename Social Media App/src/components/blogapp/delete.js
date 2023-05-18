
// import React, { useState, useEffect } from 'react';
// import {Link} from "react-router-dom";
// import Update from './update';
// import Create from './create';
// import ImageUploader from './storeImagetemporarily';
// function Blog() {

//   const [loading, setLoading] = useState(true)
//   const [blogs, setBlogs] = useState([]);
//   const [selectedBlogId, setSelectedBlogId] = useState('');
//   const [created_at, setCreatedAt] = useState("");
//   const accessToken = localStorage.getItem('accessToken');
//   const tokenParts = accessToken.split('.');
  
//   // Decode the access token payload
//   const payload = JSON.parse(atob(tokenParts[1]));
  
//   // Get the expiration time from the payload
//   const expirationTime = payload.exp;
  
//   // Calculate the remaining time in seconds until the token expires
//   const currentTime = Math.floor(Date.now() / 1000);
//   const remainingTime = expirationTime - currentTime;
  
  
//   console.log(`The access token will expire in ${remainingTime} seconds.`);
//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/api/blog/list/', {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//           }
//         });

//         if (response.status === 401) {
//           console.log("token expired and expired time is", remainingTime);
          
//           // Access token has expired, use refresh token to get a new access token
//           const refreshResponse = await fetch('http://localhost:8000/api/refresh/', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//               refresh: localStorage.getItem('refreshToken')
//             })
//           });

//           if (refreshResponse.ok) {
            
//             const tokens = await refreshResponse.json();
//             localStorage.setItem('accessToken', tokens.access);
//             // Try fetching blogs again with the new access token
//             const newResponse = await fetch('http://localhost:8000/api/blog/list/', {
//               headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//               }
//             });
//             const data = await newResponse.json();
//             setBlogs(data);
//             setLoading(false);
//           } else {
//             throw new Error('Refresh token is invalid');
//           }
//         } else {
//           const data = await response.json();
//           setBlogs(data);
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this post?')) {
//       fetch(`http://localhost:8000/api/blog/delete/${id}/`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         }
//       })
//       .then(response => {
//         if (response.ok) {
//           setBlogs(blogs.filter(blog => blog.id !== id))
//         } else {
//           throw new Error('Delete failed')
//         }
//       })
//       .catch(error => {
//         console.error(error)
//       })
//     }
//   }

//   if (loading) {
//     return <p>Loading...</p>
//   }


//   return (
//     <div>
// <ul>

//   <Link to="/update">update</Link>
//   <Link to="/create">create</Link>
//   <button>  <Link to="/uploadImg">Upload Image</Link></button>

 

//       <h1>Blog List</h1>

//       {blogs.sort((a,b) => b.id - a.id).map(blog => (
//         <li key={blog.id}>
//           <h2>{blog.title}</h2>
//           <img src={`http://localhost:8000${blog.image}`} style={{ width: "450px", maxWidth: "100%"}}/>

//           <p>{blog.content}</p>
//           <p>Author: {blog.authorName}</p>
//           <p>Published Date: {blog.created_at}</p>
//           <p>Updated Date: {blog.updated_at}</p>
//           {created_at && <p>Blog Created at Standard: {created_at}</p>}
//           <button onClick={() => handleDelete(blog.id)}>Delete</button>
//         </li>
//       ))}
//     </ul>
//     </div>
//     )
//     }
// export default Blog;
