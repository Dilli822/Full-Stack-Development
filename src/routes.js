import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blog from "./components/blogapp/blog";
import Home from "./components/blogapp/home";
import Login from "./components/blogapp/login";
import SignUp from "./components/blogapp/signup";
import ImageUploader from "./components/blogapp/storeImagetemporarily";
import Update from "./components/blogapp/update";
import Create from "./components/blogapp/create";
import Logout from "./components/blogapp/logout";
import BlogList from "./components/blogapp/blogList";
import BlogListLikes from "./components/likes/blog_Likes";
import BlogDetails from "./components/details/blogDetails";
import PasswordResetForm from "./components/resetPassword/reset_password";
import Profile from "./components/account/profile";

function MainRoute() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="signup" element={<SignUp />} exact />
            <Route path="login" element={<Login />} exact/>
            <Route path="create" element={<Create />} exact />
            <Route path="update" element={<Update />} exact />
            <Route path="blog" element={<Blog />} exact />
            <Route path="uploadImg" element={<ImageUploader/>} exact />
            <Route path="logout" element={<Logout/>} exact/>
            <Route path="bloglist" element={<BlogList/>} exact/>
            <Route path="bloglikes" element={<BlogListLikes/>} exact/>
            <Route path="/blog/:id" element={<BlogDetails/>} exact></Route>
            <Route path="reset-password" element={<PasswordResetForm/>} exact />
            <Route path="/profile/:id" element={<Profile/>} exact />
        </Routes>
      </BrowserRouter>
    );
  }

  export default MainRoute;