
// import React, { Component } from 'react';
// import axios from 'axios';
// import './App.css';
// import Login from './components/login/login';

// class App extends Component {
//   state = {
//     data: [],
//     loading: false,
//     title: "",
//     content: "",
//     category: "",
//     editingId: null
//   };

//   componentDidMount() {
//     this.getData();
//   }

//   getData = () => {
//     this.setState({ loading: true });
//     axios.get('http://127.0.0.1:8000/api/notes/')
//       .then(res => {
//         console.log(res.data.notes);
//         this.setState({ data: res.data.notes, loading: false });
//       })
//       .catch(err => {
//         console.error(err);
//         this.setState({ loading: false });
//       });
//   };

//   createData = (newData) => {
//     axios.post('http://127.0.0.1:8000/api/notes/', newData)
//       .then(res => {
//         this.getData();
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   };

//   updateData = (id, updatedData) => {
//     if (window.confirm('Are you sure you want to update this item?')) {
//     axios.patch(`http://127.0.0.1:8000/api/notes/${id}`, updatedData)
//       .then(res => {
//         this.getData();
//         this.setState({ editingId: null, title: '', content: '', category: '' });
//       })
//       .catch(err => {
//         console.error(err);
//       });
//     }
//   };

//   deleteData = (id) => {
//     if (window.confirm('Are you sure you want to permanently delete this item?')) {
//       axios.delete(`http://127.0.0.1:8000/api/notes/${id}`)
//         .then(res => {
//           this.getData();
//         })
//         .catch(err => {
//           console.error(err);
//         });
//     }
//   };
  
//   handleInputChange = (event) => {
//     this.setState({
//       [event.target.name]: event.target.value
//     });
//   };

//   handleFormSubmit = (event) => {
//     event.preventDefault();
//     if (this.state.editingId) {
//       this.updateData(this.state.editingId, { title: this.state.title, content: this.state.content, category: this.state.category });
//     } else {
//       this.createData({ title: this.state.title, content: this.state.content, category: this.state.category });
//     }
//   };
  
//   handleEditClick = (id, title, content, category) => {
//     this.setState({ editingId: id, title, content, category });
//   };

//   render() {
//   const { data, loading, title, content, category, editingId } = this.state;
//   return (
//     <div>
//       {!editingId ? (
//         <form onSubmit={this.handleFormSubmit}>
//           <label
// htmlFor="title">Title:</label>
// <input
//          type="text"
//          name="title"
//          value={title}
//          onChange={this.handleInputChange}
//        />
// <label htmlFor="content">Content:</label>
// <input
//          type="text"
//          name="content"
//          value={content}
//          onChange={this.handleInputChange}
//        />
// <label htmlFor="category">Category:</label>
// <input
//          type="text"
//          name="category"
//          value={category}
//          onChange={this.handleInputChange}
//        />
// <button type="submit" style={{ boxShadow: "none", backgroundColor: "#05FF13"}}>{editingId ? 'Update' : 'Create'} Note</button>
// </form>
// ) : (
// <div>
// <h2>Edit Note</h2>
// <form onSubmit={this.handleFormSubmit}>
// <label htmlFor="title">Title:</label>
// <input
//              type="text"
//              name="title"
//              value={title}
//              onChange={this.handleInputChange}
//            />
// <label htmlFor="content">Content:</label>
// <input
//              type="text"
//              name="content"
//              value={content}
//              onChange={this.handleInputChange}
//            />
// <label htmlFor="category">Category:</label>
// <input
//              type="text"
//              name="category"
//              value={category}
//              onChange={this.handleInputChange}
//            />
// <button type="submit">Update Note</button>
// <button onClick={() => this.setState({ editingId: null, title: '', content: '', category: '' })}>Cancel</button>
// </form>
// </div>
// )}
// {loading ? (
// <p>Loading...</p>
// ) : (
// <table style={{ width: "100%", textAlign: "left" , border: "1px solid #000"}}>
// <thead>
// <tr>
// <th>Title</th>
// <th>Content</th>
// <th>Category</th>
// <th>Actions</th>
// </tr>
// </thead>
// <tbody >
// {data.map(item => (
// <tr style={{ border: "1px solid #000" }} key={item.id}>
// <td>{item.title}</td>
// <td>{item.content}</td>
// <td>{item.category}</td>
// <td>
// <button onClick={() => this.handleEditClick(item.id, item.title, item.content, item.category)}>Edit</button>
// <button onClick={() => this.deleteData(item.id)}>Delete</button>
// </td>
// </tr>
// ))}
// </tbody>
// </table>
// )}

// <Login/>
// </div>
// );
// }
// }

// export default App;

import React,{Component} from "react";
import { Route } from "react-router-dom";
import Main_Route from './components/router/Route';

class App extends Component{
  render(){
    return(
      <div>
        <Main_Route/>
      </div>
    )
  }
}

export default App;