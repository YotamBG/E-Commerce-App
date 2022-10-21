import { Form, Container, Button } from 'react-bootstrap';
import React, { useState } from "react";


export function ProductUpload() {
  const [selectedFile, setSelectedFile] = useState();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const handleSubmission = () => {
    const formData = new FormData();

    formData.append('img', selectedFile);
    formData.append('details', JSON.stringify({ 'name': name, 'price': price, 'category': category }));

    fetch(
      'http://localhost:3000/products/new-product',
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      window.location.reload();
  };

  return (
    <Container style={{ width: '50%' }}>
      <h1>Product Upload</h1>
      <br /><br />

      <br />
      <label className="form-label">Name:</label>
      <input className='form-control' type="text" value={name} onChange={e => setName(e.target.value)} />

      <br />
      <label className="form-label">Price:</label>
      <input className='form-control' type="text" value={price} onChange={e => setPrice(e.target.value)} />

      <br />
      <label className="form-label">Category:</label>
      <input className='form-control' type="text" value={category} onChange={e => setCategory(e.target.value)} />

      <br />
      <label className="form-label">Image:</label>
      <input className='form-control' type="file" name="file" onChange={changeHandler} />
      <br /><br />

      <button onClick={handleSubmission} className='btn btn-secondary'>Submit</button>
    </Container>
  )
}
