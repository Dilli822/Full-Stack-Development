import React, { useState } from 'react';
import Blog from '../blogapp/blog';
import { Link, Navigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); // added state for redirecting

  const [errorMsg, setErrorMsg] = useState('');
  const [authMsg, setAuthMsg] = useState('');
  const [apiErrorMsg,setApiErrorMsg] = useState('');

  const handleUsernameChange =(event) => {
    if (username.length < 3) {
      setUsrErrorMessage('Username should have at least 5 characters');
    } else if(username.length > 3){
      setUsrErrorMessage('');
    }
    setUsername(event.target.value)
  };

  const handlePasswordChange = (event) => {
    if(password.length < 8){
      setPwdErrorMessage('password should have at least 8 characters');
    } else if(password.length > 8){
      setPwdErrorMessage('');
    }
    setPassword(event.target.value);
  };

  const [pwdErrorMessage, setPwdErrorMessage] = useState('');
  const [usrErrorMessage,setUsrErrorMessage] = useState('');
  

  const handleSubmit = (event) => {
    event.preventDefault();
    (!username || !password) ? setErrorMsg("Please Enter the Fields!"): setErrorMsg(""); 

      fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        else if (response.status == 400) {
          // Bad request error
          setApiErrorMsg("Please check your Inputs and try again.")
          throw new Error('Please check your inputs and try again.');
        }
        else if (response.status == 401) {
          // Authentication error
          setApiErrorMsg('Invalid credentials. Please try again with valid username and password.');
          throw new Error('Invalid Credentials. Please Try again with correct username and password.');
        }
        else if (response.status == 403) {
          // Authorization error
          setApiErrorMsg('You do not have permission to access this resource.');
          throw new Error('You do not have permission to access this resource.');
        }
        else if (response.status == 404) {
          // Resource not found error
          setApiErrorMsg('The requested resource was not found on the server.Please try again later!');
          throw new Error('The requested resource was not found on the server.');
        }  
      
        else if (response.status == 500) {
          setApiErrorMsg('Internal server error. Please try again later.');
          // Internal server error
          throw new Error('Internal server error. Please try again later.');
        } else if(response.status == 503){
          setApiErrorMsg('!Server may be down!Please Try again later');
        }
        else {
          setApiErrorMsg('server maybe down');
          // Other error
          throw new Error('Login failed. Please try again later.');
        }
      })
      .then(data => {
        // Save the refresh and access tokens in local storage or cookies
        localStorage.setItem('refreshToken', data.refresh)
        localStorage.setItem('accessToken', data.access)
        setLoggedIn(true);
        // Redirect to dashboard or homepage
      })
      .catch(error => {
        console.error(error);
        
        
      if(username && password){
        setErrorMsg("");
        setApiErrorMsg(error.message);
        return;
      }
      // else if(response.status == 503){
      //   setApiErrorMsg('!Server may be down!Please Try again later');
      // }
        setApiErrorMsg(error.message);
      })
    }
    
  if (loggedIn) { 
    // redirect to Dashboard if loggedIn is true
    return <Navigate to="/blog"/>
  }


  return (
   
    <form className="loginForm" onSubmit={handleSubmit}>
    <div class="loginContainer"> 
     <h2>Login</h2>
      <div>
        <div className="validationError">{usrErrorMessage} 
        {errorMsg} </div> 

<Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="username"
                  label="Username/Email"
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter Your Username"
                  
                />
              </Grid>

      </div>
      <div>
        <br></br>
       
        <div className="validationError"> {pwdErrorMessage}
        {errorMsg}</div> 
        <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter Your Password"
                  
                />
              </Grid>
      </div>
      <div className="validationError">{apiErrorMsg && <span>{apiErrorMsg}</span>}</div>

      <div>
  
      <Button  fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }} type="submit">Log in</Button>


      <h4>Don't have an account?</h4>
      <Link to="/signup">
        <h5>Forgot password</h5>
        <Link to="/reset-password" />
      <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            </Link>
      </div>
      </div>
    </form>
  
  );
}

export default Login;


// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import SignUp from './signup';
// import {Link} from "react-router-dom";

// function Copyright(props) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// const theme = createTheme();

// export default function Signin() {
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     console.log({
//       email: data.get('email'),
//       password: data.get('password'),
//     });
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <CssBaseline />
//         <Grid
//           item
//           xs={false}
//           sm={4}
//           md={7}
//           sx={{
//             backgroundImage: 'url(https://source.unsplash.com/random)',
//             backgroundRepeat: 'no-repeat',
//             backgroundColor: (t) =>
//               t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//         />
//         <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//           <Box
//             sx={{
//               my: 8,
//               mx: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//             }}
//           >
//             <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//               <LockOutlinedIcon />
//             </Avatar>
//             <Typography component="h1" variant="h5">
//               Sign in
//             </Typography>
//             <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
//               <TextField
              
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email Address"
//                 name="email"
//                 autoComplete="email"
//                 autoFocus
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type="password"
//                 id="password"
//                 autoComplete="current-password"
//               />
//               <FormControlLabel
//                 control={<Checkbox value="remember" color="primary" />}
//                 label="Remember me"
//               />
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//               >
//                 Sign In
//               </Button>
//               <Grid container>
//                 <Grid item xs>
//                   <Link href="#" variant="body2">
//                     Forgot password?
//                   </Link>
//                 </Grid>
//                 <Grid item>
//                   <Link to="/s  ignup" variant="body2">
//                     {"Don't have an account? Sign Up"}
//                   </Link>
//                 </Grid>
//               </Grid>
//               <Copyright sx={{ mt: 5 }} />
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </ThemeProvider>
//   );
// }