import axios from 'axios';
import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Create from './Create';

function Course() {
    


  return (
    <div className='bg-light'>
      <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="home" title="create">
        <Create/>
        </Tab>
        <Tab eventKey="contact" title="All">
        </Tab>
      </Tabs>
    </div>
  );
}

export default Course;
