import React, { Component } from 'react';
import axios from 'axios';
import Home from '../home/home';
import Signup from '../signup/Signup';
import { Link } from 'react-router-dom';

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: null,
      isLoggedIn: false,
    };
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleLogin = (event) => {
    event.preventDefault();

    axios
      .post('http://127.0.0.1:8000/authapp/login/', {
        username: this.state.username,
        password: this.state.password,
      })
      .then((response) => {
        // If login is successful, set the isLoggedIn state to true
        localStorage.setItem('token', response.data.token);
        console.log("login token ", response.data.token);
        this.setState({ isLoggedIn: true });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          // If login fails, show an error message and reset the password field
          this.setState({ error: 'Invalid credentials. Please try again.' });
          this.setState({ password: '' });
        } else {
          // If there is a different error, handle it here
        }
      });
  };
  render() {

    // If the user is already logged in, redirect to the home page
    if (this.state.isLoggedIn) {
      return <Home />
    }

    // Otherwise, render the login form
    return (
      <form onSubmit={this.handleLogin}>
        <div>
          <label>Username:</label>
          <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        </div>
        {this.state.error && <p>{this.state.error}</p>}
        <div>
          <button type="submit">Login</button>
        </div>

        <div>
          <h5>Don't Have an account Sign-up?</h5>
          <Link to="/signup">Signup</Link>
        </div>
        {this.props.message && <p>{this.props.message}</p>}
      </form>

     
    );
  }
}

export default Login;
