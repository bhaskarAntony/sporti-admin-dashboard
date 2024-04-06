import axios from 'axios';
import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import AllImages from './imageStore/AllImages';
import Loading from './Loading';

function ImageStore() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    image: null, // Use null instead of an empty string for the file input
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    // For file input, use files[0] to access the selected file
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleEventUpload = () => {
    setLoading(true)
    // Use FormData to handle file uploads
    const formDataUpload = new FormData();
    formDataUpload.append('image', formData.image);

    // Send a POST request to create a new image using FormData
    axios.post('https://comfortable-boot-fly.cyclic.app/aws/upload', formDataUpload)
  .then((response) => {
    console.log('Response:', response);
    alert('Image uploaded successfully');
    setLoading(false)
    setFormData({
      image: null,
    });
  })
  .catch((error) => {
    setLoading(false)
    console.error('Error:', error);
    alert('Error uploading image');
  });
}
if(loading){
  return <Loading/>
}



  return (
    <div className='bg-light'>
      <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="home" title="upload">
          <div className="container px-lg-5">
            <div className="card p-3">
              <h2 className='w-100 text-center'>Create Training Card</h2>
              <form>
                <div>
                  <label className='form-label'>Image: </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    className='form-control mb-3'
                  />
                </div>
                <button
                  type="button"
                  onClick={handleEventUpload}
                  className='btn btn-danger text-white'
                >
                  Upload Image
                </button>
              </form>
            </div>
          </div>
        </Tab>
        <Tab eventKey="contact" title="All">
         <AllImages/>
        </Tab>
      </Tabs>
    </div>
  );
}

export default ImageStore;
