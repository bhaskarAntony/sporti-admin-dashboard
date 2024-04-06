import axios from 'axios';
import '../styles/blogs.css'
import React, {useState, useRef, useEffect  } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill/dist/quill.snow.css';

function Job() {

    const quillRef = useRef();

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.getEditor().enable(true);
    }
  }, []);

  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['table'],
      ],
    },
  };
  const [BlogsData, setBlogsData] = useState({
    companyName: '',
    companyName: "",
    technology: "",
    jd: "",
    experience: "",
    title:"",
    openings:"",
    package:"",
    location:"",
    bond:"yes",
    link:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogsData({ ...BlogsData, [name]: value });
  };

  const handleContentChange = (jd) => {
    setBlogsData({ ...BlogsData, jd });
  };

  const handleEventUpload = (e) => {
    e.preventDefault(); // Prevent the default form submission

    axios
      .post('http://localhost:3200/api/job', BlogsData)
      .then((response) => {
        console.log(response.data);
        alert('success');
        setBlogsData({
            companyName: "",
            technology: "",
            jd: "",
            experience: "",
            title:"",
            openings:"",
            package:"",
            location:"",
            bond:"yes",
            link:""
        });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
   <div className="container-fluid bg-light">
     <div className='p-3 container'>
      <form action='post' onSubmit={handleEventUpload}>
        <div className='row'>
          <div className='col-12 col-md-4 col-lg-4 mb-3'>
            <div className='form-group'>
              <label htmlFor='title' className='form-label'>
                Company Name
              </label>

              <input
                type='text'
                name='companyName'
                className='form-control p-3'
                placeholder='Company Name'
                value={BlogsData.companyName}
                onChange={handleChange}
              />

            </div>
          </div>
          <div className='col-12 col-md-4 col-lg-4 mb-3'>
            <div className='form-group'>
              <label htmlFor='title' className='form-label'>
                Company Location
              </label>

              <input
                type='text'
                name='location'
                className='form-control p-3'
                placeholder='Company Location'
                value={BlogsData.location}
                onChange={handleChange}
              />

            </div>
          </div>
          <div className='col-12 col-md-4 col-lg-4 mb-3'>
            <div className='form-group'>
              <label htmlFor='subtitle' className='form-label'>
              Technology
              </label>

              <input
                type='text'
                name='technology'
                className='form-control p-3'
                placeholder='Technology'
                value={BlogsData.technology}
                onChange={handleChange}
              />
            </div>
          </div>
       

          <div className='col-12 col-md-4 col-lg-4 mb-3'>
            <div className='form-group'>
              <label htmlFor='title' className='form-label'>
                Job Title
              </label>
              <input
                type='text'
                name='title'
                className='form-control p-3'
                placeholder='Job Title'
                value={BlogsData.title}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='col-12 col-md-4 col-lg-4 mb-3'>
            <div className='form-group'>
              <label htmlFor='image' className='form-label'>
                Package
              </label>
              <input
                type='text'
                name='package'
                className='form-control p-3'
                placeholder='Package'
                value={BlogsData.package}
                onChange={handleChange}
              />
            </div>
          </div>
        
          <div className='col-12 col-md-4 col-lg-4 mb-3'>
            <div className='form-group'>
              <label htmlFor='openings' className='form-label'>
             Job Openings
              </label>
              <input
                type='text'
                name='openings'
                className='form-control p-3'
                placeholder='openings'
                value={BlogsData.openings}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='col-12 col-md-4 col-lg-4 mb-3'>
            <div className='form-group'>
              <label htmlFor='experience' className='form-label'>
               Experience
              </label>
              <input
                type='text'
                name='experience'
                className='form-control p-3'
                placeholder='experience'
                value={BlogsData.experience}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='col-12 col-md-4 col-lg-4 mb-3'>
            <div className='form-group'>
              <label htmlFor='experience' className='form-label'>
               Apply Link
              </label>
              <input
                type='text'
                name='link'
                className='form-control p-3'
                placeholder='link'
                value={BlogsData.link}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <label htmlFor="">Job Description</label>
        <ReactQuill  ref={quillRef}   modules={modules} value={BlogsData.jd} onChange={handleContentChange} className='editor' />
        <button type='submit' className='btn btn-danger px-3 mt-3 mx-3'>
         Reset
        </button>
        <button type='submit' className='btn btn-primary mt-3 px-3'>
          Add Post
        </button>
      </form>
    </div>
   </div>
  );
}

export default Job;
