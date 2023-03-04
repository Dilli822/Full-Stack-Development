import React, { useState, useEffect } from 'react';
import axios from 'axios';

function View() {
  const [notes, setNotes] = useState([]);
  const [searchParam, setSearchParam] = useState('');

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    
    const axiosInstance = axios.create({
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    axiosInstance.get(`http://127.0.0.1:8000/authapp/api/notes/?search=${searchParam}`)
      .then(response => {
        setNotes(response.data.notes);
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }, [searchParam]);

  const handleSearchChange = event => {
    setSearchParam(event.target.value);
  };

  return (
    <div>
        view
      <input type="text" value={searchParam} onChange={handleSearchChange} />
      {notes.map(note => (
        <div key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}

export default View;
