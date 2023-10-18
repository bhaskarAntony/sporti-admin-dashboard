import React, { useState } from 'react';
import axios from 'axios';

function EventsUpload({ onUpload }) {
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    tag: '',
    content: '',
    date: '',
    time: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleEventUpload = () => {
    // Send a POST request to create a new event using formData.
    axios.post('https://fancy-mittens-ray.cyclic.app/api/past-events/add', formData)
      .then((response) => {
        // Handle success and add the new event to the list.
        onUpload(response.data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div className='bg-light'>
      
     <div className="container px-lg-5">
     
        <div className="card p-3">
        <h2 className='w-100 text-center'>Event Upload</h2>
        <form>
        <div>
          <label className='form-label'>Title:</label>
          <input type="text" name="title" onChange={handleInputChange} value={formData.title} className='form-control mb-3' placeholder='Enter Event Title'/>
        </div>
        <div>
          <label className='form-label'>Tag:</label>
          <input type="text" name="tag" onChange={handleInputChange} value={formData.tag} className='form-control mb-3' placeholder='Enter Event Tag'/>
        </div>
        <div>
          <label className='form-label'>Content:</label>
          <textarea name="content" onChange={handleInputChange} value={formData.content} className='form-control mb-3'placeholder='Enter Event Content'/>
        </div>
        <div>
          <label className='form-label'>Date:</label>
          <input type="date" name="date" onChange={handleInputChange} value={formData.date}  className='form-control mb-3' placeholder='Select Event Date'/>
        </div>
        <div>
          <label className='form-label'>Time:</label>
          <input type="time" name="time" onChange={handleInputChange} value={formData.time} className='form-control mb-3' placeholder='Select Event Time'/>
        </div>
        <div>
          <label className='form-label'>Event Image:</label>
          <input type="url" name="image" onChange={handleInputChange} value={formData.image} className='form-control mb-3' placeholder='Enter Event image Url'/>
        </div>
        <button type="button" onClick={handleEventUpload} className='btn btn-danger text-white'>Upload Event</button>
      </form>
        </div>
     </div>
    </div>
  );
}

export default EventsUpload;
