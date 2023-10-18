import axios from 'axios';
import React, { useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function Companies() {
    const [formData, setFormData] = useState({
        name: '',
        image: '',
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
      
        const handleEventUpload = () => {
            // Send a POST request to create a new event using formData.
            axios.post('https://fancy-mittens-ray.cyclic.app/api/companies', formData)
            .then((response) => {
                console.log(response.data)
                alert("success")
                setFormData({
                    name: '',
                    image: '',
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
     <h2 className='w-100 text-center'>Create Training Card</h2>
     <form>
     <div>
       <label className='form-label'>Company Name: </label>
       <input type="text" name="name" onChange={handleInputChange} value={formData.name} className='form-control mb-3' placeholder='Enter training Mode card icon URL'/>
     </div>
     <div>
       <label className='form-label'>Company Image: </label>
       <input type="text" name="image" onChange={handleInputChange} value={formData.image} className='form-control mb-3' placeholder='Enter Training card Title'/>
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

export default Companies
