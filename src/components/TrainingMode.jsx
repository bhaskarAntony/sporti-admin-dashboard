import axios from 'axios';
import React, { useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function TrainingMode() {
    const [allcards, setAllcards] = useState([])
    const [formData, setFormData] = useState({
        image: '',
        title: '',
        description: ''
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
      
        const handleEventUpload = () => {
            // Send a POST request to create a new event using formData.
            axios.post('https://fancy-mittens-ray.cyclic.app/api/trainingmodes', formData)
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                alert(error);
            });
        };
  return (
    <div className='bg-light'>
         <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="home" title="Create">
      <div className="container px-lg-5">
     
     <div className="card p-3">
     <h2 className='w-100 text-center'>Create Training Card</h2>
     <form>
     <div>
       <label className='form-label'>Image: </label>
       <input type="text" name="image" onChange={handleInputChange} value={formData.image} className='form-control mb-3' placeholder='Enter training Mode card icon URL'/>
     </div>
     <div>
       <label className='form-label'>Title: </label>
       <input type="text" name="title" onChange={handleInputChange} value={formData.title} className='form-control mb-3' placeholder='Enter Training card Title'/>
     </div>
     <div>
       <label className='form-label'>Description: </label>
       <textarea name="description" onChange={handleInputChange} value={formData.description} className='form-control mb-3'placeholder='EnterTraining Card Description'/>
     </div>
     <button type="button" onClick={handleEventUpload} className='btn btn-danger text-white'>Create Traning Card </button>
   </form>
     </div>
  </div>
      </Tab>
      <Tab eventKey="profile" title="Update">
        Tab content for Profile
      </Tab>
      <Tab eventKey="contact" title="All">
        Tab content for Contact
      </Tab>
    </Tabs>
      
   
    </div>
  )
}

export default TrainingMode
