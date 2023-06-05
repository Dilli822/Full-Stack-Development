

import { useState, useEffect } from "react";

export default function Comments() {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState([]);


  const [anchorEls, setAnchorEls] = useState(new Array(blogs.length).fill(null));
  const [shareUrls, setShareUrls] = useState(new Array(blogs.length).fill(""));
  const [copiedStates, setCopiedStates] = useState(new Array(blogs.length).fill(false));

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

  return (
    <div>

{comments
            .filter((comment) => comment.blog == blogs.id)
            .map((comment) => (
              <div key={comment.id}>
                <p>Comment by: {comment.author}</p>
                <p>{comment.comment_content}</p>
              
              </div>
            ))}
   
    </div>
  );
}
  