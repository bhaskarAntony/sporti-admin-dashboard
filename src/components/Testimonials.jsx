import axios from 'axios';
import React, { useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function Testimonials() {
    const [formData, setFormData] = useState({
        name: '',
        content: '',
        role:'',
        rating:''
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
      
        const handleEventUpload = () => {
            // Send a POST request to create a new event using formData.
            axios.post('https://fancy-mittens-ray.cyclic.app/api/testimonials', formData)
            .then((response) => {
                console.log(response.data)
                alert("success")
                setFormData({
                    name: '',
                    content: '',
                    role:'',
                    rating:''
                })
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
     <h2 className='w-100 text-center'>Create Student Feedback</h2>
     <form>
     <div>
       <label className='form-label'>Student Name:</label>
       <input type="text" name="name" onChange={handleInputChange} value={formData.name} className='form-control mb-3' placeholder='Enter Student Name'/>
     </div>
     <div>
       <label className='form-label'>Role:</label>
       <input type="url" name="role" onChange={handleInputChange} value={formData.role} className='form-control mb-3' placeholder='Enter role'/>
     </div>
     <div>
       <label className='form-label'>Student rating: </label>
       <input type="url" name="rating" onChange={handleInputChange} value={formData.rating} className='form-control mb-3' placeholder='Enter rating'/>
     </div>
     <div>
       <label className='form-label'>Student feedback: </label>
       <textarea name="content" onChange={handleInputChange} value={formData.content} className='form-control mb-3'placeholder='Enter Student feedback'/>
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

export default Testimonials
