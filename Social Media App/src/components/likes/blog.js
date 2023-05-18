
// import { useState, useEffect } from "react";
// import { IconButton } from "@mui/material";
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';

// export default function Likes() {
//   const [blogs, setBlogs] = useState([]);
//   const [error, setError] = useState(null);
//   const [authorId,setAuthorId] = useState(0);
//   const [countLikes, setCountLikes] = useState(0);
//   const [likedBy,setLikedBy] = useState(0);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/blog/list/", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           },
//         });

//         const data = await response.json();

//         // Initialize liked state for each blog post
//         const blogsWithLiked = data.map((blog) => ({ ...blog, liked: false }));

//         setBlogs(blogsWithLiked);
//         setLikedBy(blogsWithLiked.liked_by);
//         setCountLikes(blogsWithLiked);
//         setAuthorId(blogsWithLiked.author);
//       } catch (error) {
//         console.error(error);
//         setError("Failed to fetch blog posts.");
//       }
//     };

//     fetchBlogs();
//   }, []);
  
//   const handleLikeClick = (blogId) => {
//     const index = blogs.findIndex((blog) => blog.id === blogId);
//     const blogToUpdate = { ...blogs[index] };
  
//     if (blogToUpdate.liked) {
//       // If the blog post is already liked, decrease the like count by 1
//       blogToUpdate.likes--;
//     } else {
//       // If the blog post is not liked, increase the like count by 1
//       blogToUpdate.likes++;
//     }
  
//     // Toggle the liked state for the blog post
//     blogToUpdate.liked = !blogToUpdate.liked;
  
//     // Update the state with the new liked state and like count
//     const newBlogs = [...blogs];
//     newBlogs[index] = blogToUpdate;
//     setBlogs(newBlogs);
  
//     // Update the API with the new liked state and like count
//     fetch(`http://localhost:8000/api/blog/likes/update/${blogId}/`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         liked: blogToUpdate.liked,
//         likes: blogToUpdate.likes,
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => console.log(data))
//       .catch((error) => {
//         console.error(error);
//         setError("Failed to update like state.");
//       });
//   };


//   return (
//     <div>
//       {error && <p>{error}</p>}
//       <h2>Blogs</h2>
//       <div className="blogs">
//         {blogs.map((blog) => (
//           <div key={blog.id}>
//             <h3>{blog.title}</h3>
//             <p>{blog.content}</p>
//             <p>
//               Author: {blog.author.first_name} {blog.author.last_name}
//             </p>
//             <p> {blog.liked_by}</p>
//             <p>Likes: {blog.likes}</p>
// {blog.liked_by}
// { 
//   blog.liked_by.includes(blog.author) 
//     ? <div>yes you liked</div>
//     : <div>no you did not like</div>
// }
// <IconButton >
//   <FavoriteIcon color={blog.liked_by.includes(blog.author_id) ? "error" : "primary"} />
// </IconButton>


//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

export default function Likes() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [authorId,setAuthorId] = useState(0);
  const [countLikes, setCountLikes] = useState(0);
  const [likedBy,setLikedBy] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/blog/list/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = await response.json();

        // Initialize liked state for each blog post
        const blogsWithLiked = data.map((blog) => ({ ...blog, liked: false }));

        setBlogs(blogsWithLiked);
        setLikedBy(blogsWithLiked.liked_by);
        setCountLikes(blogsWithLiked);
        setAuthorId(blogsWithLiked.author);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch blog posts.");
      }
    };

    fetchBlogs();
  }, []);
  



  return (
    <div>
      {error && <p>{error}</p>}
      <h2>Blogs</h2>
      <div className="blogs">
        {blogs.map((blog) => (
          <div key={blog.id}>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <p>
              Author: {blog.author.first_name} {blog.author.last_name}
            </p>
            <p> {blog.liked_by}</p>
            <p>Likes: {blog.likes}</p>
liked/by{blog.liked_by} <br></br>
author id{blog.author_id}
{ 
  blog.liked_by.includes(blog.author) 
    ? <div>yes you liked</div>
    : <div>no you did not like</div>
}
<IconButton>
  <FavoriteIcon color={blog.liked_by.includes(blog.author_id) ? "error" : "primary"} />
</IconButton>


          </div>
        ))}
      </div>
    </div>
  );
}


