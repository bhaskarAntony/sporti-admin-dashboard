import axios from 'axios';
import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UploadDatas from './UploadData';
import Subcourses from './Subcourses';

function CreateCourses() {
    


  return (
    <div className='bg-light'>
      <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="home" title="course">
        <UploadDatas/>
        </Tab>
        <Tab eventKey="contact" title="subcourse">
          <Subcourses/>
        </Tab>
      </Tabs>
    </div>
  );
}

export default CreateCourses;
