import React, { Component } from "react";
import axios from "axios";

class Home extends Component {
  state = {
    username: "",
    password: "",
    notes: [],
    newNoteTitle: "",
    newNoteContent: "",
    token: null,
    isUserAuthenticated: false,
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleLogin = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/appy/api/login/", {
        username: this.state.username,
        password: this.state.password,
      })
      .then((response) => {
        this.setState({
          token: response.data.token,
          isUserAuthenticated: true,
        });
        axios.defaults.headers.common["Authorization"] = `JWT ${response.data.token}`;
        this.getNotes();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleLogout = () => {
    this.setState({
      token: null,
      isUserAuthenticated: false,
      notes: [],
      newNoteTitle: "",
      newNoteContent: "",
    });
    axios.defaults.headers.common["Authorization"] = null;
  };

  getNotes = () => {
    axios
      .get("http://localhost:8000/appy/api/notes/")
      .then((response) => {
        this.setState({
          notes: response.data.notes,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleNoteCreate = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/appy/api/notes/", {
        title: this.state.newNoteTitle,
        content: this.state.newNoteContent,
      })
      .then((response) => {
        this.setState({
          newNoteTitle: "",
          newNoteContent: "",
        });
        this.getNotes();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleNoteDelete = (note) => {
    axios
      .delete(`http://localhost:8000/appy/api/notes/${note.id}/`)
      .then((response) => {
        this.getNotes();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    if (this.state.token) {
      axios.defaults.headers.common["Authorization"] = `JWT ${this.state.token}`;
      this.getNotes();
    }
  }

  render() {
    if (!this.state.isUserAuthenticated) {
      return (
        <div>
          <h2>Login</h2>
          <form onSubmit={this.handleLogin}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={this.state.username}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Notes</h2>
          <button onClick={this.handleLogout}>Logout</button>
          <form onSubmit={this.handleNoteCreate}>
        <div>
          <label htmlFor="newNoteContent">Content:</label>
          <textarea
            id="newNoteContent"
            name="newNoteContent"
            value={this.state.newNoteContent}
            onChange={this.handleInputChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
      <ul>
        {this.state.notes.map((note) => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => this.handleNoteDelete(note)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
}
}

export default Home;