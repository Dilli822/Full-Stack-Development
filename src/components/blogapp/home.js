import React, { useState, useEffect } from "react";


import { Button } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
// import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import SignUp from '../account/signup';
import {Link, useNavigate} from "react-router-dom";



function Home(){

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
<div>


<div className="container">
      <header className="blog-header py-3">
        <div className="row flex-nowrap justify-content-between align-items-center">
          <div className="col-4 pt-1">
            <a className="text-muted" href="#">Subscribe</a>
          </div>
          <div className="col-4 text-center">
            <a className="blog-header-logo text-dark" href="#">Large</a>
          </div>
          <div className="col-4 d-flex justify-content-end align-items-center">
            <a className="text-muted" href="#">
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-3"><circle cx="10.5" cy="10.5" r="7.5"></circle><line x1="21" y1="21" x2="15.8" y2="15.8"></line></svg> */}
            </a>
            <Link to="/signup"> <a className="btn btn-sm btn-outline-secondary" href="#">Sign up</a> </Link>
             <a className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>Logout</a> 
          </div>
        </div>
      </header>

      <div class="nav-scroller py-1 mb-2">

        <nav className="nav d-flex justify-content-between">
          <a className="p-2 text-muted" href="#">World</a>
          <a className="p-2 text-muted" href="#">U.S.</a>
          <a className="p-2 text-muted" href="#">Technology</a>
          <a className="p-2 text-muted" href="#">Design</a>
          <a className="p-2 text-muted" href="#">Culture</a>
          <a className="p-2 text-muted" href="#">Business</a>
          <a className="p-2 text-muted" href="#">Politics</a>
          <a className="p-2 text-muted" href="#">Opinion</a>
          <a className="p-2 text-muted" href="#">Science</a>
          <a className="p-2 text-muted" href="#">Health</a>
          <a className="p-2 text-muted" href="#">Style</a>
          <a className="p-2 text-muted" href="#">Travel</a>
        </nav>

      </div>

      <div className="jumbotron p-3 p-md-5 text-white rounded bg-dark">

        <div className="col-md-6 px-0">
          <h1 className="display-4 font-italic">Title of a longer featured blog post</h1>
          <p className="lead my-3">Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.</p>
          <p className="lead mb-0"><a href="#" class="text-white font-weight-bold">Continue reading...</a></p>
        </div>

      </div>

      <div className="row mb-2">

        <div className="col-md-6">
          <div className="card flex-md-row mb-4 box-shadow h-md-250">
            <div className="card-body d-flex flex-column align-items-start">
              <strong className="d-inline-block mb-2 text-primary">World</strong>
              <h3 className="mb-0">
                <a className="text-dark" href="#">Featured post</a>
              </h3>
              <div className="mb-1 text-muted">Nov 12</div>
              <p className="card-text mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
              <a href="#">Continue reading</a>
            </div>
            <img className="card-img-right flex-auto d-none d-md-block" src="https://unsplash.it/200" alt="Card image cap"></img>
          </div>

        </div>


        <div className="col-md-6">
          <div className="card flex-md-row mb-4 box-shadow h-md-250">
            <div className="card-body d-flex flex-column align-items-start">
              <strong className="d-inline-block mb-2 text-primary">World</strong>
              <h3 className="mb-0">
                <a className="text-dark" href="#">Featured post</a>
              </h3>
              <div className="mb-1 text-muted">Nov 12</div>
              <p className="card-text mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
              <a href="#">Continue reading</a>
            </div>
            <img className="card-img-right flex-auto d-none d-md-block" src="https://unsplash.it/200" alt="Card image cap"></img>
          </div>

        </div>



    <main className="container">
      <div className="row">
        <div className="col-md-8 blog-main">
          <h3 className="pb-3 mb-4 font-italic border-bottom">
            From the Firehose
          </h3>

          <div className="blog-post">
            <h2 className="blog-post-title">Sample blog post</h2>
            <p className="blog-post-meta">January 1, 2014 by <a href="#">Mark</a></p>

            <p>This blog post shows a few different types of content that's supported and styled with Bootstrap. Basic typography, images, and code are all supported.</p>
            <hr></hr>
            <p>Cum sociis natoque penatibus et magnis <a href="#">dis parturient montes</a>, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.</p>
            <blockquote>
              <p>Curabitur blandit tempus porttitor. <strong>Nullam quis risus eget urna mollis</strong> ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
            </blockquote>
            <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
            <h2>Heading</h2>
            <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
            <h3>Sub-heading</h3>
            <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
            <pre><code>Example code block</code></pre>
            <p>Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa.</p>
            <h3>Sub-heading</h3>
            <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
            <ul>
              <li>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li>
              <li>Donec id elit non mi porta gravida at eget metus.</li>
              <li>Nulla vitae elit libero, a pharetra augue.</li>
            </ul>
            <p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue.</p>
            <ol>
              <li>Vestibulum id ligula porta felis euismod semper.</li>
              <li>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</li>
              <li>Maecenas sed diam eget risus varius blandit sit amet non magna.</li>
            </ol>
            <p>Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis.</p>
          </div>

          <div className="blog-post">
            <h2 className="blog-post-title">Another blog post</h2>
            <p className="blog-post-meta">December 23, 2013 by <a href="#">Jacob</a></p>

            <p>Cum sociis natoque penatibus et magnis <a href="#">dis parturient montes</a>, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.</p>
            <blockquote>
              <p>Curabitur blandit tempus porttitor. <strong>Nullam quis risus eget urna mollis</strong> ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
            </blockquote>
            <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
            <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
          </div>

          <div className="blog-post">
            <h2 className="blog-post-title">New feature</h2>
            <p className="blog-post-meta">December 14, 2013 by <a href="#">Chris</a></p>

            <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
            <ul>
              <li>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li>
              <li>Donec id elit non mi porta gravida at eget metus.</li>
              <li>Nulla vitae elit libero, a pharetra augue.</li>
            </ul>
            <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
            <p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue.</p>
          </div>  
        
          <nav className="blog-pagination">
            <a className="btn btn-outline-primary" href="#">Older</a>
            <a className="btn btn-outline-secondary disabled" href="#">Newer</a>
          </nav>

        </div>

        <aside className="col-md-4 blog-sidebar">
          <div className="p-3 mb-3 bg-light rounded">
            <h4 className="font-italic">About</h4>
            <p className="mb-0">Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
          </div>

          <div className="p-3">
            <h4 className="font-italic">Archives</h4>
            <ol className="list-unstyled mb-0">
              <li><a href="#">March 2014</a></li>
              <li><a href="#">February 2014</a></li>
              <li><a href="#">January 2014</a></li>
              <li><a href="#">December 2013</a></li>
              <li><a href="#">November 2013</a></li>
              <li><a href="#">October 2013</a></li>
              <li><a href="#">September 2013</a></li>
              <li><a href="#">August 2013</a></li>
              <li><a href="#">July 2013</a></li>
              <li><a href="#">June 2013</a></li>
              <li><a href="#">May 2013</a></li>
              <li><a href="#">April 2013</a></li>
            </ol>
          </div>

          <div className="p-3">
            <h4 className="font-italic">Elsewhere</h4>
            <ol className="list-unstyled">
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Facebook</a></li>
            </ol>
          </div> 
        </aside> 

      </div>

    </main>

    <footer className="blog-footer">
      <p>Blog template built for <a href="https://getbootstrap.com/">Bootstrap</a> by <a href="https://twitter.com/mdo">@mdo</a>.</p>
      <p>
        <a href="#">Back to top</a>
      </p>
    </footer>

    </div>
  

    </div>  </div>  
    )
}

export default Home;


