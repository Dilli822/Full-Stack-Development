import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Container } from "@mui/material";
// import { Link } from "react-router-dom";
// import Update from "./update";
// import Create from "./create";
// import Logout from "./logout";
// import ImageUploader from "./storeImagetemporarily";
// import Login from "./login";
// import { useNavigate } from 'react-router-dom';

// function Blog() {
//     const [loading, setLoading] = useState(true);
//     const [newBlogTitle, setNewBlogTitle] = useState("");
//     const [newBlogContent, setNewBlogContent] = useState("");
//     const [newBlogAuthorName, setNewBlogAuthorName] = useState("");

//     const [blogs, setBlogs] = useState([]);
//     const [selectedBlogId, setSelectedBlogId] = useState("");
//     const [updatedBlogTitle, setUpdatedBlogTitle] = useState(undefined);
//     const [updatedBlogContent, setUpdatedBlogContent] = useState(undefined);
//     const [updatedBlogAuthorName, setUpdatedBlogAuthorName] = useState(undefined);

//     const [newBlogImage, setNewBlogImage] = useState(null);
//     const [updatedBlogImage, setUpdatedBlogImage] = useState(null);

//     const [imageUrl, setImageUrl] = useState(null);

//     const [created_at, setCreatedAt] = useState("");
//     const accessToken = localStorage.getItem("accessToken");
//     const tokenParts = accessToken.split(".");

//     // Decode the access token payload
//     const payload = JSON.parse(atob(tokenParts[1]));

//     // Get the expiration time from the payload
//     const expirationTime = payload.exp;

//     // Calculate the remaining time in seconds until the token expires
//     const currentTime = Math.floor(Date.now() / 1000);
//     const remainingTime = expirationTime - currentTime;

//     console.log(`The access token will expire in ${remainingTime} seconds.`);
//     useEffect(() => {
//         const fetchBlogs = async () => {
//             try {
//                 const response = await fetch("http://localhost:8000/api/blog/list/", {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                     },
//                 });

//                 if (response.status === 401) {
//                     console.log("token expired and expired time is", remainingTime);

//                     // Access token has expired, use refresh token to get a new access token
//                     const refreshResponse = await fetch("http://localhost:8000/api/refresh/", {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json",
//                         },
//                         body: JSON.stringify({
//                             refresh: localStorage.getItem("refreshToken"),
//                         }),
//                     });

//                     if (refreshResponse.ok) {
//                         const tokens = await refreshResponse.json();
//                         localStorage.setItem("accessToken", tokens.access);
//                         // Try fetching blogs again with the new access token
//                         const newResponse = await fetch("http://localhost:8000/api/blog/list/", {
//                             headers: {
//                                 Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                             },
//                         });
//                         const data = await newResponse.json();
//                         setBlogs(data);
//                         setLoading(false);
//                     } else {
//                         throw new Error("Refresh token is invalid");
//                     }
//                 } else {
//                     const data = await response.json();
//                     setBlogs(data);
//                     setLoading(false);
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchBlogs();
//     }, []);

//     const handleCreate = () => {
//         const newBlog = {
//             title: newBlogTitle,
//             content: newBlogContent,
//             authorName: newBlogAuthorName,
//             image: newBlogImage, // Add the image file to the new blog object
//         };

//         const formData = new FormData();
//         formData.append("title", newBlog.title);
//         formData.append("content", newBlog.content);
//         formData.append("authorName", newBlog.authorName);
//         if(newBlogImage != null){
//             formData.append('image', newBlogImage);
//         }

//         fetch("http://localhost:8000/api/blog/create/", {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//             },
//             body: formData, // Use the form data instead of JSON.stringify
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 setBlogs([...blogs, data]);
//                 setNewBlogTitle("");
//                 setNewBlogContent("");
//                 setNewBlogAuthorName("");
//                 setNewBlogImage(null); // Reset the image state after submitting the form
//             });
//     };

//     const handleDelete = (id) => {
//         if (window.confirm("Are you sure you want to delete this post?")) {
//             fetch(`http://localhost:8000/api/blog/delete/${id}/`, {
//                 method: "DELETE",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                 },
//             })
//                 .then((response) => {
//                     if (response.ok) {
//                         setBlogs(blogs.filter((blog) => blog.id !== id));
//                     } else {
//                         throw new Error("Delete failed");
//                     }
//                 })
//                 .catch((error) => {
//                     console.error(error);
//                 });
//         }
//     };

//     const handleUpdate = () => {
//         const updatedBlog = {
//             id: selectedBlogId,
//             title: updatedBlogTitle === undefined ? blogs.find((blog) => blog.id === selectedBlogId).title : updatedBlogTitle,
//             content: updatedBlogContent === undefined ? blogs.find((blog) => blog.id === selectedBlogId).content : updatedBlogContent,
//             authorName: updatedBlogAuthorName === undefined ? blogs.find((blog) => blog.id === selectedBlogId).authorName : updatedBlogAuthorName,
//         };

//         const formData = new FormData();
//         formData.append("title", updatedBlog.title);
//         formData.append("content", updatedBlog.content);
//         formData.append("authorName", updatedBlog.authorName);
//         if(updatedBlogImage != null){
//             formData.append('image', updatedBlogImage);
//         }

//         fetch(`http://localhost:8000/api/blog/update/${updatedBlog.id}/`, {
//             method: "PUT",
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//             },
//             body: formData,
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 const index = blogs.findIndex((blog) => blog.id === data.id);
//                 const newBlogs = [...blogs];
//                 newBlogs[index] = data;
//                 setBlogs(newBlogs);
//                 setSelectedBlogId("");
//                 setUpdatedBlogTitle(undefined);
//                 setUpdatedBlogContent(undefined);
//                 setUpdatedBlogAuthorName(undefined);
//                 setUpdatedBlogImage(null);
//             })
//             .catch((error) => console.error(error));
//     };
    
//   const navigate = useNavigate();

//   const  handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//     // Remove access token and refresh token from local storage
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');

//     // Navigate to the login page
  
//     navigate('/login');
//   } }

//     if (loading) {
//         return <span class="loader"></span>
//     }

//     return (

//         <div>


//         <div style={{ display: "flex", justifyContent: "space-around" , flexWrap: "wrap-reverse" , width: "100%", padding: "0 55px", margin: "0 35px"}}>

//         <div style={{ margin: "0px", width: "50%"}}>
          
            
//             <div>



//                 <h1>Blog List</h1>

//                 {blogs
//                     .sort((a, b) => b.id - a.id)
//                     .map((blog) => (
//                         <div key={blog.id}>
//                             <h2>{blog.title}</h2>
//                             <img src={`http://localhost:8000${blog.image}`} style={{ width: "450px", maxWidth: "100%" }} />

//                             <p>{blog.content}</p>
//                             <p>Author: {blog.authorName}</p>
//                             <p>Published Date: {blog.created_at}</p>
//                             <p>Updated Date: {blog.updated_at}</p>
//                             {created_at && <p>Blog Created at Standard: {created_at}</p>}
//                             <button className="update" onClick={() => setSelectedBlogId(blog.id)}>Edit</button>
//                             <button className="delete" onClick={() => handleDelete(blog.id)}>Delete</button>
//                         </div>
//                     ))}
//             </div>
//         </div>

//         <div style={{margin: "0px" ,width: "50%"}}> 

//         <button onClick={handleLogout}>Logout</button>
//         <div style={{ position: "fixed"}}>
//         <h2>Create New Blog</h2>
//                     <label>
//                         Title: </label><br></br>
//                         <input type="text" value={newBlogTitle} onChange={(event) => setNewBlogTitle(event.target.value)} />
                   
//                     <br />
//                     <label>
//                         Content: </label> <br></br>
//                         <textarea value={newBlogContent} onChange={(event) => setNewBlogContent(event.target.value)} />
                   
//                     <br />
//                     <label>
//                         Author Name:    </label>  <br></br>
//                         <input type="text" value={newBlogAuthorName} onChange={(event) => setNewBlogAuthorName(event.target.value)} />
                 

//                     <div>
//                         <label htmlFor="newBlogImage">Image:</label> 
//                         <input style={{backgroundColor: "transparent"}} type="file" id="newBlogImage" name="newBlogImage" onChange={(event) => setNewBlogImage(event.target.files[0])} />
//                     </div>
//                     <button  className="create" onClick={handleCreate}>Create Blog</button>


//                                     {/* <UpdateBlog/> */}
//                 {selectedBlogId !== "" && (
//                     <div style={{ width: "auto"}}>
//                         <h2>Update Blog "{blogs.find((blog) => blog.id === selectedBlogId).title}"</h2>

//                         <div>
//                             <label htmlFor="blog-title">Title:</label> <br></br>
//                             <input type="text" id="blog-title" value={updatedBlogTitle === undefined ? blogs.find((blog) => blog.id === selectedBlogId).title : updatedBlogTitle} onChange={(e) => setUpdatedBlogTitle(e.target.value)} />
//                         </div>

//                         <div>
//                             <label htmlFor="blog-content">Content:</label> <br></br>
//                             <textarea id="blog-content" value={updatedBlogContent === undefined ? blogs.find((blog) => blog.id === selectedBlogId).content : updatedBlogContent} onChange={(e) => setUpdatedBlogContent(e.target.value)} />
//                         </div>

//                         <div>
//                             <label htmlFor="blog-author-name">Author Name:</label> <br></br>
//                             <input
//                                 type="text"
//                                 id="blog-author-name"
//                                 value={updatedBlogAuthorName === undefined ? blogs.find((blog) => blog.id === selectedBlogId).authorName : updatedBlogAuthorName}
//                                 onChange={(e) => setUpdatedBlogAuthorName(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="updatedBlogImage">Image:</label>
//                             <img src={`http://localhost:8000${blogs.find((blog) => blog.id === selectedBlogId).image}`} style={{ width: "50px", maxWidth: "100%" }} />
//                             <input style={{backgroundColor: "transparent"}} type="file" id="updatedBlogImage" name="updatedBlogImage" onChange={(event) => setUpdatedBlogImage(event.target.files[0])} />
//                         </div>
                    

//                         <button className="update"  onClick={handleUpdate}>Update Blog</button>
//                         <button className="cancel" onClick={() => setSelectedBlogId("")}>Cancel</button>
//                     </div>
//                 )}

               
//         </div>
        
//         </div>
//         </div>
//         </div>
//     );
// }
// export default Blog;


import { Button } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
// import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import SignUp from './signup';
import {Link, useNavigate} from "react-router-dom";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
return (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);
}

TabPanel.propTypes = {
children: PropTypes.node,
index: PropTypes.number.isRequired,
value: PropTypes.number.isRequired,
};

function a11yProps(index) {
return {
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
};
}

function Blog() {
const [value, setValue] = React.useState(0);

const handleChange = (event, newValue) => {
  setValue(newValue);
};

    const [loading, setLoading] = useState(true);
    const [newBlogTitle, setNewBlogTitle] = useState("");
    const [newBlogContent, setNewBlogContent] = useState("");
    const [newBlogAuthorName, setNewBlogAuthorName] = useState("");

    const [blogs, setBlogs] = useState([]);
    const [selectedBlogId, setSelectedBlogId] = useState("");
    const [updatedBlogTitle, setUpdatedBlogTitle] = useState(undefined);
    const [updatedBlogContent, setUpdatedBlogContent] = useState(undefined);
    const [updatedBlogAuthorName, setUpdatedBlogAuthorName] = useState(undefined);

    const [newBlogImage, setNewBlogImage] = useState(null);
    const [updatedBlogImage, setUpdatedBlogImage] = useState(null);

    const [imageUrl, setImageUrl] = useState(null);

    const [created_at, setCreatedAt] = useState("");
    const accessToken = localStorage.getItem("accessToken");
    const tokenParts = accessToken.split(".");

    // Decode the access token payload
    const payload = JSON.parse(atob(tokenParts[1]));

    // Get the expiration time from the payload
    const expirationTime = payload.exp;

    // Calculate the remaining time in seconds until the token expires
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = expirationTime - currentTime;

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
                        setBlogs(data);
                        console.log(data);
                        setLoading(false);
                    } else {
                        throw new Error("Refresh token is invalid");
                    }
                } else {
                    const data = await response.json();
                    setBlogs(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchBlogs();
    }, []);

    const handleCreate = () => {
        const newBlog = {
            title: newBlogTitle,
            content: newBlogContent,
            authorName: newBlogAuthorName,
            image: newBlogImage, // Add the image file to the new blog object
        };

        const formData = new FormData();
        formData.append("title", newBlog.title);
        formData.append("content", newBlog.content);
        formData.append("authorName", newBlog.authorName);
        if(newBlogImage != null){
            formData.append('image', newBlogImage);
        }

        fetch("http://localhost:8000/api/blog/create/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formData, // Use the form data instead of JSON.stringify
        })
            .then((response) => response.json())
            .then((data) => {
                setBlogs([...blogs, data]);
                setNewBlogTitle("");
                setNewBlogContent("");
                setNewBlogAuthorName("");
                setNewBlogImage(null); // Reset the image state after submitting the form
            });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            fetch(`http://localhost:8000/api/blog/delete/${id}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        setBlogs(blogs.filter((blog) => blog.id !== id));
                    } else {
                        throw new Error("Delete failed");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const handleUpdate = () => {
        const updatedBlog = {
            id: selectedBlogId,
            title: updatedBlogTitle === undefined ? blogs.find((blog) => blog.id === selectedBlogId).title : updatedBlogTitle,
            content: updatedBlogContent === undefined ? blogs.find((blog) => blog.id === selectedBlogId).content : updatedBlogContent,
            authorName: updatedBlogAuthorName === undefined ? blogs.find((blog) => blog.id === selectedBlogId).authorName : updatedBlogAuthorName,
        };

        const formData = new FormData();
        formData.append("title", updatedBlog.title);
        formData.append("content", updatedBlog.content);
        formData.append("authorName", updatedBlog.authorName);
        if(updatedBlogImage != null){
            formData.append('image', updatedBlogImage);
        }

        fetch(`http://localhost:8000/api/blog/update/${updatedBlog.id}/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                const index = blogs.findIndex((blog) => blog.id === data.id);
                const newBlogs = [...blogs];
                newBlogs[index] = data;
                
                setBlogs(newBlogs);
                setSelectedBlogId("");
                setUpdatedBlogTitle(undefined);
                setUpdatedBlogContent(undefined);
                setUpdatedBlogAuthorName(undefined);
                setUpdatedBlogImage(null);
            })
            .catch((error) => console.error(error));
    };
    
  const navigate = useNavigate();

  const  handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
    // Remove access token and refresh token from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Navigate to the login page
  
    navigate('/login');
  } }

    if (loading) {
        return <span class="loader"></span>
    }

    

    return(

//         <div>

//             <div class="container">

// <nav class="navbar navbar-light">
// <div class="col" role="presentation">
//       <Breadcrumbs aria-label="breadcrumb">
//         <Link
//           underline="hover"
//           sx={{ display: 'flex', alignItems: 'center' }}
//           color="inherit"
//           href="/"
//         >
//           <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
//           MUI
//         </Link>
//         <Link
//           underline="hover"
//           sx={{ display: 'flex', alignItems: 'center' }}
//           color="inherit"
//           href="/material-ui/getting-started/installation/"
//         >
//           <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
//           Core
//         </Link>
//         <Typography
//           sx={{ display: 'flex', alignItems: 'center' }}
//           color="text.primary"
//         >
//           <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
//           Breadcrumb
//         </Typography>
//       </Breadcrumbs>
//     </div>
// </nav>

//             </div>


//             <div class="container">

//                 <div class="row">
               
 
//                 </div>
//   <div class="row">
//     <div class="col col-lg-9">
      
//      <div class="container">

//      <div class="col">
//         <img src="https://unsplash.it/500" />
//       </div>


//       <div class="col col-lg-9">
//        <div class="row">
        
//         <div class="col">
//         adsfasfa
//         </div>

//         <div class="col">
//         adsfasfa
//         </div>

//        </div>
//       </div>

//      </div>

//     </div>

//     <div class="col col-lg-3">
//           <div>
//             <input placeholder='Search Blogs Here.....'></input>
//             <button>Search</button>
//             </div>
//           <div>Search List</div>
//     </div>
//   </div>
// </div>
//         </div>

// <div>

// <div className="container">
//       <header className="blog-header py-3">
//         <div className="row flex-nowrap justify-content-between align-items-center">
//           <div className="col-4 pt-1">
//             <a className="text-muted" href="#">Subscribe</a>
//           </div>
//           <div className="col-4 text-center">
//             <a className="blog-header-logo text-dark" href="#">Large</a>
//           </div>
//           <div className="col-4 d-flex justify-content-end align-items-center">
//             <a className="text-muted" href="#">

//             </a>
//             <Link to="/signup"> <a className="btn btn-sm btn-outline-secondary" href="#">Sign up</a> </Link>
//              <a className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>Logout</a> 
//           </div>
//         </div>
//       </header>

//       <div class="nav-scroller py-1 mb-2">

//         <nav className="nav d-flex justify-content-between">
//           <a className="p-2 text-muted" href="#">World</a>
//           <a className="p-2 text-muted" href="#">U.S.</a>
//           <a className="p-2 text-muted" href="#">Technology</a>
//           <a className="p-2 text-muted" href="#">Design</a>
//           <a className="p-2 text-muted" href="#">Culture</a>
//           <a className="p-2 text-muted" href="#">Business</a>
//           <a className="p-2 text-muted" href="#">Politics</a>
//           <a className="p-2 text-muted" href="#">Opinion</a>
//           <a className="p-2 text-muted" href="#">Science</a>
//           <a className="p-2 text-muted" href="#">Health</a>
//           <a className="p-2 text-muted" href="#">Style</a>
//           <a className="p-2 text-muted" href="#">Travel</a>
//         </nav>

//       </div>

//       <div className="jumbotron p-3 p-md-5 text-white rounded bg-dark">

//         <div className="col-md-6 px-0">
//           <h1 className="display-4 font-italic">Title of a longer featured blog post</h1>
//           <p className="lead my-3">Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.</p>
//           <p className="lead mb-0"><a href="#" class="text-white font-weight-bold">Continue reading...</a></p>
//         </div>

//       </div>

//       <div className="row mb-2">

//         <div className="col-md-6">
//           <div className="card flex-md-row mb-4 box-shadow h-md-250">
//             <div className="card-body d-flex flex-column align-items-start">
//               <strong className="d-inline-block mb-2 text-primary">World</strong>
//               <h3 className="mb-0">
//                 <a className="text-dark" href="#">Featured post</a>
//               </h3>
//               <div className="mb-1 text-muted">Nov 12</div>
//               <p className="card-text mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
//               <a href="#">Continue reading</a>
//             </div>
//             <img className="card-img-right flex-auto d-none d-md-block" src="https://unsplash.it/200" alt="Card image cap"></img>
//           </div>

//         </div>


//         <div className="col-md-6">
//           <div className="card flex-md-row mb-4 box-shadow h-md-250">
//             <div className="card-body d-flex flex-column align-items-start">
//               <strong className="d-inline-block mb-2 text-primary">World</strong>
//               <h3 className="mb-0">
//                 <a className="text-dark" href="#">Featured post</a>
//               </h3>
//               <div className="mb-1 text-muted">Nov 12</div>
//               <p className="card-text mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
//               <a href="#">Continue reading</a>
//             </div>
//             <img className="card-img-right flex-auto d-none d-md-block" src="https://unsplash.it/200" alt="Card image cap"></img>
//           </div>

//         </div>



//     <main className="container">
//       <div className="row">
//         <div className="col-md-8 blog-main">
//           <h3 className="pb-3 mb-4 font-italic border-bottom">
//             From the Firehose
//           </h3>

//           <div className="blog-post">
//             <h2 className="blog-post-title">Sample blog post</h2>
//             <p className="blog-post-meta">January 1, 2014 by <a href="#">Mark</a></p>

//             <p>This blog post shows a few different types of content that's supported and styled with Bootstrap. Basic typography, images, and code are all supported.</p>
//             <hr></hr>
//             <p>Cum sociis natoque penatibus et magnis <a href="#">dis parturient montes</a>, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.</p>
//             <blockquote>
//               <p>Curabitur blandit tempus porttitor. <strong>Nullam quis risus eget urna mollis</strong> ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
//             </blockquote>
//             <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
//             <h2>Heading</h2>
//             <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
//             <h3>Sub-heading</h3>
//             <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
//             <pre><code>Example code block</code></pre>
//             <p>Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa.</p>
//             <h3>Sub-heading</h3>
//             <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
//             <ul>
//               <li>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li>
//               <li>Donec id elit non mi porta gravida at eget metus.</li>
//               <li>Nulla vitae elit libero, a pharetra augue.</li>
//             </ul>
//             <p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue.</p>
//             <ol>
//               <li>Vestibulum id ligula porta felis euismod semper.</li>
//               <li>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</li>
//               <li>Maecenas sed diam eget risus varius blandit sit amet non magna.</li>
//             </ol>
//             <p>Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis.</p>
//           </div>

//           <div className="blog-post">
//             <h2 className="blog-post-title">Another blog post</h2>
//             <p className="blog-post-meta">December 23, 2013 by <a href="#">Jacob</a></p>

//             <p>Cum sociis natoque penatibus et magnis <a href="#">dis parturient montes</a>, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.</p>
//             <blockquote>
//               <p>Curabitur blandit tempus porttitor. <strong>Nullam quis risus eget urna mollis</strong> ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
//             </blockquote>
//             <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
//             <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
//           </div>

//           <div className="blog-post">
//             <h2 className="blog-post-title">New feature</h2>
//             <p className="blog-post-meta">December 14, 2013 by <a href="#">Chris</a></p>

//             <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
//             <ul>
//               <li>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li>
//               <li>Donec id elit non mi porta gravida at eget metus.</li>
//               <li>Nulla vitae elit libero, a pharetra augue.</li>
//             </ul>
//             <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
//             <p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue.</p>
//           </div>  
        
//           <nav className="blog-pagination">
//             <a className="btn btn-outline-primary" href="#">Older</a>
//             <a className="btn btn-outline-secondary disabled" href="#">Newer</a>
//           </nav>

//         </div>

//         <aside className="col-md-4 blog-sidebar">
//           <div className="p-3 mb-3 bg-light rounded">
//             <h4 className="font-italic">About</h4>
//             <p className="mb-0">Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
//           </div>

//           <div className="p-3">
//             <h4 className="font-italic">Archives</h4>
//             <ol className="list-unstyled mb-0">
//               <li><a href="#">March 2014</a></li>
//               <li><a href="#">February 2014</a></li>
//               <li><a href="#">January 2014</a></li>
//               <li><a href="#">December 2013</a></li>
//               <li><a href="#">November 2013</a></li>
//               <li><a href="#">October 2013</a></li>
//               <li><a href="#">September 2013</a></li>
//               <li><a href="#">August 2013</a></li>
//               <li><a href="#">July 2013</a></li>
//               <li><a href="#">June 2013</a></li>
//               <li><a href="#">May 2013</a></li>
//               <li><a href="#">April 2013</a></li>
//             </ol>
//           </div>

//           <div className="p-3">
//             <h4 className="font-italic">Elsewhere</h4>
//             <ol className="list-unstyled">
//               <li><a href="#">GitHub</a></li>
//               <li><a href="#">Twitter</a></li>
//               <li><a href="#">Facebook</a></li>
//             </ol>
//           </div> 
//         </aside> 

//       </div>

//     </main>

//     <footer className="blog-footer">
//       <p>Blog template built for <a href="https://getbootstrap.com/">Bootstrap</a> by <a href="https://twitter.com/mdo">@mdo</a>.</p>
//       <p>
//         <a href="#">Back to top</a>
//       </p>
//     </footer>

//     </div>
  

//     </div>  </div> 
<div>

<Container maxWidth="" >
<div  style={{ position: "sticky", top: "0", width: "100%"}}>
        <div style={{ padding: "15px", backgroundColor: "#FFF"}}>
            <div class="row">
                <div class="col-3">Profile</div>
                <div class="col-6">
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="NewsFeed" {...a11yProps(0)} />
          <Tab label="Update/Edit" {...a11yProps(1)} />
          <Tab label="Create/Add New" {...a11yProps(2)} />
        </Tabs>
                </div>
                <div class="col-3">Search</div>
            </div>
            </div>
           
            </div>

 <div  style={{ width: "100%"}}>
        <div style={{ padding: "15px", backgroundColor: "#FFf"}}>
        <div class="row">
                <div class="col-3">col</div>
                <div class="col-6">

                <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}></Box>
      <TabPanel value={value} index={0}>
{blogs
    .sort((a, b) => b.id - a.id)
   .map((blog) => (
       <div key={blog.id}>
           <h2>{blog.title}</h2>
           <img src={`http://localhost:8000${blog.image}`} style={{ width: "auto", maxWidth: "100%" }} />

            <p>{blog.content}</p>
            <p>Author: {blog.authorName}</p>
           <p>Published Date: {blog.created_at}</p>
            <p>Updated Date: {blog.updated_at}</p>
            {created_at && <p>Blog Created at Standard: {created_at}</p>}
            {/* <button className="update" onClick={() => setSelectedBlogId(blog.id)}>Edit</button>
            <button className="delete" onClick={() => handleDelete(blog.id)}>Delete</button> */}
            <hr></hr>
        </div>
       
    ))} 
      </TabPanel>
      <TabPanel value={value} index={1}>
       Update/Edit Blog

       <div>
       {blogs
    .sort((a, b) => b.id - a.id)
   .map((blog) => (
       <div key={blog.id}>
           <h2>{blog.title}</h2>
           <img src={`http://localhost:8000${blog.image}`} style={{ width: "auto", maxWidth: "100%" }} />

            <p>{blog.content}</p>
            <p>Author: {blog.authorName}</p>
           <p>Published Date: {blog.created_at}</p>
            <p>Updated Date: {blog.updated_at}</p>
            {created_at && <p>Blog Created at Standard: {created_at}</p>}
            <button className="update" onClick={() => setSelectedBlogId(blog.id)}>Edit</button>
            <button className="delete" onClick={() => handleDelete(blog.id)}>Delete</button>
            <hr></hr>
        </div>
       
    ))} 
       </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
      Create/Add New Blog
      <div>
      <h2>Create New Blog</h2>
                    <label>
                        Title: </label><br></br>
                        <input type="text" value={newBlogTitle} onChange={(event) => setNewBlogTitle(event.target.value)} />
                   
                    <br />
                    <label>
                        Content: </label> <br></br>
                        <textarea value={newBlogContent} onChange={(event) => setNewBlogContent(event.target.value)} />
                   
                    <br />
                    <label>
                        Author Name:    </label>  <br></br>
                        <input type="text" value={newBlogAuthorName} onChange={(event) => setNewBlogAuthorName(event.target.value)} />
                 

                    <div>
                        <label htmlFor="newBlogImage">Image:</label> 
                        <input style={{backgroundColor: "transparent"}} type="file" id="newBlogImage" name="newBlogImage" onChange={(event) => setNewBlogImage(event.target.files[0])} />
                    </div>
                    <button  className="create" onClick={handleCreate}>Create Blog</button>


                                    {/* <UpdateBlog/> */}
                {selectedBlogId !== "" && (
                    <div style={{ width: "auto"}}>
                        <h2>Update Blog "{blogs.find((blog) => blog.id === selectedBlogId).title}"</h2>

                        <div>
                            <label htmlFor="blog-title">Title:</label> <br></br>
                            <input type="text" id="blog-title" value={updatedBlogTitle === undefined ? blogs.find((blog) => blog.id === selectedBlogId).title : updatedBlogTitle} onChange={(e) => setUpdatedBlogTitle(e.target.value)} />
                        </div>

                        <div>
                            <label htmlFor="blog-content">Content:</label> <br></br>
                            <textarea id="blog-content" value={updatedBlogContent === undefined ? blogs.find((blog) => blog.id === selectedBlogId).content : updatedBlogContent} onChange={(e) => setUpdatedBlogContent(e.target.value)} />
                        </div>

                        <div>
                            <label htmlFor="blog-author-name">Author Name:</label> <br></br>
                            <input
                                type="text"
                                id="blog-author-name"
                                value={updatedBlogAuthorName === undefined ? blogs.find((blog) => blog.id === selectedBlogId).authorName : updatedBlogAuthorName}
                                onChange={(e) => setUpdatedBlogAuthorName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="updatedBlogImage">Image:</label>
                            <img src={`http://localhost:8000${blogs.find((blog) => blog.id === selectedBlogId).image}`} style={{ width: "50px", maxWidth: "100%" }} />
                            <input style={{backgroundColor: "transparent"}} type="file" id="updatedBlogImage" name="updatedBlogImage" onChange={(event) => setUpdatedBlogImage(event.target.files[0])} />
                        </div>
                    

                        <button className="update"  onClick={handleUpdate}>Update Blog</button>
                        <button className="cancel" onClick={() => setSelectedBlogId("")}>Cancel</button>
                    </div>
                )}

               
      </div>
      </TabPanel>
    </Box>

                </div>
                <div class="col-3">col</div>
            </div>
            </div>
           
            </div>
            </Container>
</div>

)}

export default Blog;


