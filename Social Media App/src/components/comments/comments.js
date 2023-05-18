// import { useState, useEffect } from "react";

// function Comments () {
//   const [comments, setComments] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [likes, setLikes] = useState([]);
//   const [liked, setLiked] = useState([]);
//   const [shareUrls, setShareUrls] = useState(new Array(blogs.length).fill(""));
//   useEffect(() => {
//     const fetchLikes = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/blog/likes/", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           },
//         });
  
//         if (response.ok) {
//           const data = await response.json();
//           const blogLikes = data.map((blog) => {
//             return {
//               id: blog.id,
//               likes: blog.likes,
//               liked_state: blog.liked_state,
//               title: blog.title,
//               image: blog.image,
//               content: blog.content,
//               authorName: blog.authorName,
//               created_at: blog.created_at,
//               updated_at: blog.updated_at,
//             };
//           });
  
//           // Store the mapped data in a variable
//           const mappedData = blogLikes;
  
//           setBlogs(mappedData);
//           setLikes(mappedData.map((blog) => blog.likes));
//           setLiked(mappedData.map((blog) => blog.liked_state));
  
//           console.log(mappedData);
//           setShareUrls(mappedData.map((blog) => `${window.location.origin}/blog/${blog.id}`));
  
//           // Call the fetchComments function and pass the mapped data
//           fetchComments(mappedData);
//         } else {
//           console.error("Failed to fetch likes");
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
  
//     const fetchComments = async (mappedData) => {
//       try {
//         const response = await fetch("http://localhost:8000/api/blog/comments/", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           },
//         });
  
//         if (response.ok) {
//           const data = await response.json();
//           console.log("comments are ", data);
//           setComments(data);
  
//           // Use the mapped data and comments data together
//           // Combine the mapped data and comments data as needed
//           const combinedData = {
//             mappedData: mappedData,
//             commentsData: data,
//           };
  
//           // Process the combined data as needed
//           console.log("Combined data:", combinedData);
//         } else {
//           console.error("Failed to fetch comments");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     };
  
//     fetchLikes();
//   }, []);
  

//   return (
//   <div>
//   {combinedData.mappedData.map((blog) => (
//     <div key={blog.id}>
//       <h3>{blog.title}</h3>
//       <p>Likes: {blog.likes}</p>
//       {/* Render other properties of the blog as needed */}
//     </div>
//   ))}
//   {combinedData.commentsData.map((comment) => (
//     <div key={comment.id}>
//       <h3>{comment.title}</h3>
//       <p>{comment.comment_content}</p>
//       {/* Render other properties of the comment as needed */}
//     </div>
//   ))}
// </div>
// );

// };

// export default Comments;

import { useState, useEffect } from "react";

export default function Comments() {
  const [comments, setComments] = useState([]);

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

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
   
          <p>comments: {comment.comment_content}</p>
          <p>commented_by: {comment.author}</p>
        </div>
      ))}
    </div>
  );
      }

//   const [comments, setComments] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [likes, setLikes] = useState([]);
//   const [liked, setLiked] = useState([]);
//   const [shareUrls, setShareUrls] = useState([]);
//   const [combinedData, setCombinedData] = useState([])
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const likesResponse = await fetch("http://localhost:8000/api/blog/likes/", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });
//       const commentsResponse = await fetch("http://localhost:8000/api/blog/comments/", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });
  
//       if (likesResponse.ok && commentsResponse.ok) {
//         const likesData = await likesResponse.json();
//         const commentsData = await commentsResponse.json();
  
//         const mappedData = likesData.map((blog) => ({
//           id: blog.id,
//           likes: blog.likes,
//           liked_state: blog.liked_state,
//           title: blog.title,
//           image: blog.image,
//           content: blog.content,
//           authorName: blog.authorName,
//           created_at: blog.created_at,
//           updated_at: blog.updated_at,
//         }));
  
//         const combinedData = mappedData.map((blog) => {
//           const comment = commentsData.find((c) => c.blogId === blog.id);
//           return {
//             ...blog,
//             comment: comment ? comment.comment_content : null,
//           };
//         });
  
//         setCombinedData("combined data --->", combinedData);
//         setBlogs(mappedData);
//         setLikes(mappedData.map((blog) => blog.likes));
//         setLiked(mappedData.map((blog) => blog.liked_state));
//         setComments(commentsData);
//       } else {
//         console.error("Failed to fetch data");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };
  

//   return (
//     <div>
//       {combinedData.map((blog) => (
//         <div key={blog.id}>
//           <h3>{blog.title}</h3>
//           <p>Likes: {blog.likes}</p>
//           <p>Comment: {blog.comment}</p>   {blog.comment && <p>Comment: {blog.comment}</p>}
//           {/* Render other properties of the blog as needed */}
//         </div>
//       ))}
//     </div>
//   );
// }