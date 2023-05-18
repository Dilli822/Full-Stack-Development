import React, { useEffect, useState } from 'react';

const Likes = () => {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);

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
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
          <p>Author: {blog.authorName}</p>
          <p>Likes: {blog.likes}</p>
          <h3>Comments:</h3>
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
  );
};

export default Likes;
