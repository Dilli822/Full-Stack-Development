// import React, {Component} from "react";
// import axios from 'axios';
// import { useHistory,useNavigate, Link } from "react-router-dom";

// class Signup extends Component {

//     constructor(props){
//         super(props);
//         this.state = {
//             username: '',
//             email: '',
//             password: '',
//             error: null,
//         };
//     }
    

//     handleUsernameChange = (event) => {
//         this.setState({ username: event.target.value });
//     };

//     handleEmailChange = (event) => {
//         this.setState({ email: event.target.value });
//     };

//     handlePasswordChange = (event) => {
//         this.setState({ password: event.target.value });
//     };

//     call = () =>{
//         console.log(this.props.history);
//         console.log(this.props.history);
//     }
//     const navigate = useNavigate();
//     handleSignup = (event) => {
//         event.preventDefault();
    
//         // Password complexity validation
//         const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
//         if (!passwordRegex.test(this.state.password)) {
//           this.setState({ error: 'Password must contain at least 8 characters including 1 uppercase, 1 lowercase, 1 digit and 1 special character' });
//           return;
//         }

    
//         // Call the signup API with the user's data
//         axios.post('http://127.0.0.1:8000/authapp/signup/', {
//             username: this.state.username,
//             password: this.state.password,
//             email: this.state.email,
            
//         })
//         .then((response) => {
//             localStorage.setItem('token', response.data.token);
//             console.log("signup token ", response.data.token);
//             history.push('/home');
           
//         })
//         .catch((error) => {
//             console.log(error);
//             this.setState({ error: 'An error occurred while signing up. Please try again.' });
//         });
//     };



//     render() {
//         return (
//             <div>
//                 <h3>Signup</h3>
//                 <form onSubmit={this.handleSignup}>
//                     <div>
//                         <label>Username:</label>
//                         <input type="text" value={this.state.username} onChange={this.handleUsernameChange} required />
//                     </div>
//                     <div>
//                         <label>Email:</label>
//                         <input type="email" value={this.state.email} onChange={this.handleEmailChange} required />
//                     </div>
//                     <div>
//                         <label>Password:</label>
//                         <input type="password" value={this.state.password} onChange={this.handlePasswordChange} required />
//                     </div>
//                     {this.state.error && <p>{this.state.error}</p>}
//                     <div>
//                         <button type="submit">Signup</button>

//                         <h5>Already Have an Account?</h5>
//                         <Link to="/login">Login</Link>

                        
//                     </div>
//                 </form>
//             </div>
//         );
//     }
// }

// export default Signup;

import React, { useState } from "react";
import axios from 'axios';
import { useHistory, useNavigate, Link } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSignup = (event) => {
        event.preventDefault();

        // Password complexity validation
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must contain at least 8 characters including 1 uppercase, 1 lowercase, 1 digit and 1 special character');
            return;
        }

        // Call the signup API with the user's data
        axios.post('http://127.0.0.1:8000/authapp/signup/', {
            username: username,
            password: password,
            email: email,
        })
        .then((response) => {
            localStorage.setItem('token', response.data.token);
            console.log("signup token ", response.data.token);
            
            setMessage("Successfully signed up!Please wait you been redirecting to login page......");
            setTimeout(() => {
                setMessage("");
                navigate("/login");
            }, 1500); // show message for 3 seconds before navigating to login page
        })
        .catch((error) => {
            console.log(error);
            setError('An error occurred while signing up. Please try again.');
            setMessage('');
        });
    };

    return (
        <div>
            <h3>Signup</h3>
            <form onSubmit={handleSignup}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={handleUsernameChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={handleEmailChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange} required />
                </div>
                {error && <p>{error}</p>}
                {message && <h4>{message}</h4>}
                <div>
                    <button type="submit">Signup</button>
                    <h5>Already Have an Account?</h5>
                    <Link to="/login">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;
