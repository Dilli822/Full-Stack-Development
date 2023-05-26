import React from "react";

export default function Custom_States(){
    const [loading, setLoading] = useState(true)
    const [newBlogTitle, setNewBlogTitle] = useState('')
    const [newBlogContent, setNewBlogContent] = useState('')
    const [newBlogAuthorName, setNewBlogAuthorName] = useState('')
  
  
    const [blogs, setBlogs] = useState([]);
    const [selectedBlogId, setSelectedBlogId] = useState('');
    const [updatedBlogTitle, setUpdatedBlogTitle] = useState(undefined);
    const [updatedBlogContent, setUpdatedBlogContent] = useState(undefined);
    const [updatedBlogAuthorName, setUpdatedBlogAuthorName] = useState(undefined);
    
    const [newBlogImage, setNewBlogImage] = useState(null);
    const [updatedBlogImage, setUpdatedBlogImage] = useState(null);
  
    const [imageUrl, setImageUrl] = useState(null);
    
    const [created_at, setCreatedAt] = useState("");
    const accessToken = localStorage.getItem('accessToken');
    const tokenParts = accessToken.split('.');
    
    // Decode the access token payload
    const payload = JSON.parse(atob(tokenParts[1]));
    
    // Get the expiration time from the payload
    const expirationTime = payload.exp;
    
    // Calculate the remaining time in seconds until the token expires
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = expirationTime - currentTime;

    return(
        <div>
            
        </div>
    )
}