import React, { useState } from 'react';

function ImageUploader() {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImage(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} /> <br></br>
      {image && <img src={image} alt="Uploaded Image" style={{width: "300px"}} />}
    </div>
  );
}

export default ImageUploader;
