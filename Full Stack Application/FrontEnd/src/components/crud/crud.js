//I have received token from server side now send same received token when calling restful apis so that restful api will allow to use crud operation in below react code.
import React, { Component } from 'react';
import axios from 'axios';
const token = localStorage.getItem('token');
console.log(token);
const isLoggedIn = token && !isTokenExpired(token);

class Crud extends Component {
  state = {
    data: [],
    loading: false,
    title: "",
    content: "",
    category: "",
    editingId: null,
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios.get('http://127.0.0.1:8000/authapp/api/notes/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        console.log(res.data.notes);
        this.setState({ data: res.data.notes, loading: false });
        console.log("crud token", token);
      })
      .catch(err => {
        console.error("error ", err);
        this.setState({ loading: false });
      });
  }
  
  getData = () => {
    this.setState({ loading: true });
    axios.get('http://127.0.0.1:8000/authapp/api/notes/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        console.log(res.data.notes);
        this.setState({ data: res.data.notes, loading: false });
      })
      .catch(err => {
        console.error("error ", err);
        this.setState({ loading: false });
      });
  };
  
  createData = (newData) => {
    axios.post('http://127.0.0.1:8000/authapp/api/notes/', newData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        this.getData();
      })
      .catch(err => {
        console.error(err);
      });
  };
  
  updateData = (id, updatedData) => {
    if (window.confirm('Are you sure you want to update this item?')) {
      axios.patch(`http://127.0.0.1:8000/authapp/api/notes/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          this.getData();
          this.setState({ editingId: null, title: '', content: '', category: '' });
        })
        .catch(err => {
          console.error(err);
        });
    }
  };
  
  deleteData = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      axios.delete(`http://127.0.0.1:8000/authapp/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          this.getData();
        })
        .catch(err => {
          console.error(err);
        });
    }
  };
  
  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    if (this.state.editingId) {
      this.updateData(this.state.editingId, { title: this.state.title, content: this.state.content, category: this.state.category });
    } else {
      this.createData({ title: this.state.title, content: this.state.content, category: this.state.category });
    }
  };

  render() {
    const token = localStorage.getItem('token');

  const { data, loading, title, content, category, editingId } = this.state;
  return isLoggedIn ?(
    <div>
      <div style={{width: "200px", fontSize: "10px"}}>{token}</div>
      {!editingId ? (
        <form onSubmit={this.handleFormSubmit}>
          <label
htmlFor="title">Title:</label>
<input
         type="text"
         name="title"
         value={title}
         onChange={this.handleInputChange}
       />
<label htmlFor="content">Content:</label>
<input
         type="text"
         name="content"
         value={content}
         onChange={this.handleInputChange}
       />
<label htmlFor="category">Category:</label>
<input
         type="text"
         name="category"
         value={category}
         onChange={this.handleInputChange}
       />
<button type="submit" style={{ boxShadow: "none", backgroundColor: "#05FF13"}}>{editingId ? 'Update' : 'Create'} Note</button>
</form>
) : (
<div>
<h2>Edit Note</h2>
<form onSubmit={this.handleFormSubmit}>
<label htmlFor="title">Title:</label>
<input
             type="text"
             name="title"
             value={title}
             onChange={this.handleInputChange}
           />
<label htmlFor="content">Content:</label>
<input
             type="text"
             name="content"
             value={content}
             onChange={this.handleInputChange}
           />
<label htmlFor="category">Category:</label>
<input
             type="text"
             name="category"
             value={category}
             onChange={this.handleInputChange}
           />
<button type="submit">Update Note</button>
<button onClick={() => this.setState({ editingId: null, title: '', content: '', category: '' })}>Cancel</button>
</form>
</div>
)}
{loading ? (
<p>Loading...</p>
) : (
<table style={{ width: "100%", textAlign: "left" , border: "1px solid #000"}}>
<thead>
<tr>
<th>Title</th>
<th>Content</th>
<th>Category</th>
<th>Actions</th>
</tr>
</thead>
<tbody >
{data.map(item => (
<tr style={{ border: "1px solid #000" }} key={item.id}>
<td>{item.title}</td>
<td>{item.content}</td>
<td>{item.category}</td>
<td>
<button onClick={() => this.handleEditClick(item.id, item.title, item.content, item.category)}>Edit</button>
<button onClick={() => this.deleteData(item.id)}>Delete</button>
</td>
</tr>
))}
</tbody>
</table>
)}

</div>

)
: (
  // render a message or redirect to a login page if user is not logged in
  <div>
    <h1>Please Log In</h1>
    <p>You need to be logged in to see this content.</p>
  </div>
);

  }
}

function isTokenExpired(token) {
  // implement token expiration check logic here
  return false; // placeholder implementation
}
export default Crud;


