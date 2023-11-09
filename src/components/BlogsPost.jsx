import axios from 'axios';
import '../styles/blogs.css'
import React, {useState, useRef, useEffect  } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill/dist/quill.snow.css';

function BlogPost() {
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
    title: '',
    subtitle: '',
    content: '', // Separate content state
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogsData({ ...BlogsData, [name]: value });
  };

  const handleContentChange = (content) => {
    setBlogsData({ ...BlogsData, content });
  };

  const handleEventUpload = (e) => {
    e.preventDefault(); // Prevent the default form submission

    axios
      .post('http://localhost:3300/api/blogs/add', BlogsData)
      .then((response) => {
        console.log(response.data);
        alert('success');
        setBlogsData({
          title: '',
          subtitle: '',
          content: '',
          image: '',
        });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
   <div className="container-fluid bg-light">
     <div className='p-3 container '>
      <form action='post' onSubmit={handleEventUpload}>
        <div className='row'>
          <div className='col-12 col-md-4 col-lg-4 mb-3'>
            <div className='form-group'>
              <label htmlFor='title' className='form-label'>
                Title
              </label>
              <input
                type='text'
                name='title'
                className='form-control p-3'
                placeholder='Blog Title'
                value={BlogsData.title}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='col-12 col-md-4 col-lg-4 mb-3'>
            <div className='form-group'>
              <label htmlFor='subtitle' className='form-label'>
                Subtitle
              </label>
              <input
                type='text'
                name='subtitle'
                className='form-control p-3'
                placeholder='Blog Subtitle'
                value={BlogsData.subtitle}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='col-12 col-md-4 col-lg-4 mb-3'>
            <div className='form-group'>
              <label htmlFor='image' className='form-label'>
                Blog Image URL
              </label>
              <input
                type='text'
                name='image'
                className='form-control p-3'
                placeholder='https://Blogs-image.jpg'
                value={BlogsData.image}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <ReactQuill  ref={quillRef}   modules={modules} value={BlogsData.content} onChange={handleContentChange} className='editor' />
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

export default BlogPost;
