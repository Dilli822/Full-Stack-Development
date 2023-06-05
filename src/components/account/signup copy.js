import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [passwordValidation, setPasswordValidation] = useState("");
    const [emailValidation, setEmailValidation] = useState("");
    const [confirmPwdMsg, setConfirmPwdMsg] = useState("");
    const [register, setRegister] = useState(false);
    const [message, setMessage] = useState("");
    const [apiError, setApiError] = useState("");
    const [userErrorMessage, setUserErrorMessage] = useState("");
    const [usernameExistsError, setUsernameExistsError] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [emailExist, setEmailExist] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // added check for empty input fields
        if (!username || !password || !email || !confirmPassword || !first_name || !last_name) {
            setErrorMsg("Please fill in all the required fields!");
            return;
        }
  
        const userData = {
            username,
            email,
            password,
            first_name,
            last_name,
        };
        
        fetch("http://localhost:8000/api/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        }).then((response) => {
            response.json().then((data) => {
                console.log(data);
                if (data.username) {
                    console.log(data.username);
                    setErrorMessage(data.username);
                } else if (data.email) {
                    console.log(data.email);
                    setEmailExist(data.email);
                }
            }).catch(error => {
                console.error(error);
            });

            if (response.status === 201 || response.ok) {
                setRegister(true);
                setMessage("Successfully signed up! Please wait while you are redirected to the login page...");
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else if (response.status === 409) {
                setErrorMessage("USERNAME EXISTS");
                throw new Error('Username is already taken');
            } else if (response.status === 400) {
                setApiError("Bad request! An error occurred while signing up. Please try again.");
            } else {
                setApiError("Something went wrong!");
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
      };
  
      const handleLastNameChange = (event) => {
          setLastName(event.target.value);
      };
  
      const handleEmailChange = (event) => {
          const { value } = event.target;
          setEmail(value);
  
          // Email validation using regular expression
          const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
          (!emailRegex.test(value))
              ? setEmailValidation('Please enter a valid email address.')
              : setEmailValidation('');
      };
  
      // Rest of the code...
  
      return (
          <div>
              {register ? (
                  <div>
                      <h4>{message}</h4>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit}>
                      <ThemeProvider theme={theme}>
                          <Container component="main" maxWidth="xs">
                              <CssBaseline />
                              <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                      <LockOutlinedIcon />
                                  </Avatar>
                                  <Typography component="h1" variant="h5">
                                      Sign up
                                  </Typography>
                                  <Box sx={{ mt: 3 }}>
                                      <Grid container spacing={2}>
                                          <Grid item xs={12} sm={6}>
                                              <TextField
                                                  autoComplete="given-name"
                                                  name="firstName"
                                                  required
                                                  fullWidth
                                                  label="First Name"
                                                  autoFocus
                                                  type="text"
                                                  id="firstName"
                                                  value={first_name}
                                                  onChange={handleFirstNameChange}
                                                  placeholder="Enter First Name"
                                              />
                                          </Grid>
                                          <Grid item xs={12} sm={6}>
                                              <TextField
                                                  autoComplete="family-name"
                                                  name="lastName"
                                                  required
                                                  fullWidth
                                                  label="Last Name"
                                                  type="text"
                                                  id="lastName"
                                                  value={last_name}
                                                  onChange={handleLastNameChange}
                                                  placeholder="Enter Last Name"
                                              />
                                          </Grid>
                                          <Grid item xs={12} sm={12}>
                                              <div className="validationError">
                                                  {errorMsg}
                                              </div>
                                              <TextField
                                                  autoComplete="given-name"
                                                  name="username"
                                                  required
                                                  fullWidth
                                                  label="Username"
                                                  autoFocus
                                                  type="text"
                                                  id="username"
                                                  value={username}
                                                  onChange={handleUsernameChange}
                                                  placeholder="Enter Username"
                                              />
                                          </Grid>
                                          <Grid item xs={12} sm={12}>
                                              <div className="validationError">
                                                  {emailValidation} {errorMsg} {emailExist}
                                              </div>
                                              <TextField
                                                  autoComplete="given-name"
                                                  name="email"
                                                  required
                                                  fullWidth
                                                  type="email"
                                                  id="email"
                                                  value={email}
                                                  onChange={handleEmailChange}
                                                  placeholder="Enter Email"
                                                  label="Email"
                                                  autoFocus
                                              />
                                          </Grid>
                                          {/* Rest of the code... */}
                                      </Grid>
                                      <div className="validationError">{apiError && <h4>{apiError}</h4>}</div>
                         <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
                        <Link to="/login"> <a>Already Have an Account? Login </a></Link>
                   
                   
                                      {/* Rest of the code... */}
                                  </Box>
                              </Box>
                          </Container>
                      </ThemeProvider>
                  </form>
              )}
          </div>
      );
  }
  
  export default Signup;
  



function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

// export default function SignUp() {
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
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             marginTop: 8,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Sign up
//           </Typography>
//           <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={12}>
//                 <TextField
//                   autoComplete="given-name"
//                   name="firstName"
//                   required
//                   fullWidth
//                   id="firstName"
//                   label="Username"
//                   autoFocus
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   id="email"
//                   label="Email Address"
//                   name="email"
//                   autoComplete="email"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   name="password"
//                   label="Password"
//                   type="password"
//                   id="password"
//                   autoComplete="new-password"
//                 />
//               </Grid>

//             </Grid>
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//             >
//               Sign Up
//             </Button>
//             <Grid container justifyContent="flex-end">
//               <Grid item>
//                 <Link to="/login" variant="body2">
//                   Already have an account? Sign in
//                 </Link>
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>
//         <Copyright sx={{ mt: 5 }} />
//       </Container>
//     </ThemeProvider>
  // );
// }