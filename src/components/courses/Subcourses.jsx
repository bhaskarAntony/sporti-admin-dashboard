import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createCourse } from '../../Data/apiService';
import axios from 'axios';
import Loading from '../Loading';

const Subcourses = () => {
    const [allCourses, setAllCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [courseId, setCourseId] = useState('')
  const [courseData, setCourseData] = useState({
    tag:'',
    courseName: '',
    courseImage:'',
    heroSubtitle: '',
    coursePoints:'',
    BrocherLink: '',
    courseDescription: '',
    certification:'',
    courseFor:'',
    modules:[],
    Benifits:'',
    Designation:'',
    AnnualSalary:'',
    faqs: [],
    programmingLanguages: [],
    seo:{
      title:'',
      description:'',
      keywords:'',
      Tag_H1:'',
      canonical_url:''
    },
    details:{
      Instructor:'',
      Duration:'',
      admisionStart:''
    },
  });
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await axios.get('https://comfortable-boot-fly.cyclic.app/api/allcourses');
        setLoading(false)
        console.log(response.data.courses);
        setAllCourses(response.data.courses)
      } catch (error) {
        setLoading(false)
        console.error('Error fetching courses:', error);
      }
    };

    fetchAllCourses();
  }, []);

  const handleChange = (key, value) => {
    if (key.includes('.')) {
      const [parentKey, nestedKey] = key.split('.');
      setCourseData({
        ...courseData,
        [parentKey]: {
          ...courseData[parentKey],
          [nestedKey]: value
        }
      });
    } else {
      setCourseData({ ...courseData, [key]: value });
    }
  };

  const handleAddFAQ = () => {
    setCourseData((prevData) => ({
      ...prevData,
      faqs: [...prevData.faqs, { question: '', answer: '' }],
    }));
  };
  const handleAddModule = () => {
    setCourseData((prevData) => ({
      ...prevData,
      modules: [...prevData.modules, { title: '', description: '' }],
    }));
  };

  const handleAddLanguage = () => {
    setCourseData((prevData) => ({
      ...prevData,
      programmingLanguages: [...prevData.programmingLanguages, { name: '', image: '' }],
    }));
  };

  const handleUpload = async () => {
    setLoading(true)
    console.log(courseData);
    try {
      const response = await axios.post(`http://localhost:3300/api/allcourses/${courseId}/subcourses`, courseData);
      console.log(response.data); // Log response data to see server's response
      setLoading(false)
      alert('Course uploaded successfully');
    } catch (error) {
      setLoading(false)
      console.error('Error uploading course:', error);
      alert('Error uploading course:', error.message);
    }
  };
  if(loading){
    return <Loading/>
  }
  

  return (
    <div className='course-upload container-fluid p-3 light-bg'>

      <div className="course-details bg-white mb-4 p-3 border">
        <h2>Course Details</h2>
        <div className="form-group">
            <label htmlFor="" className="form-label">Select course</label>
            <select
            name="courseId"
            className='form-select p-3 mb-3'
            value={courseId}
            onChange={(e) => {setCourseId(e.target.value)}}
            >
                <option value="" disabled selected>Select course</option>
                {
                    allCourses.map((item, index)=>(
                        <option value={item._id}>{item.courseName}</option>
                    ))
                }
            </select>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="row">
                    <h1>SEO</h1>
                    <div className="col-12 col-md-3">
                    <label htmlFor="" className="form-label">Title</label>
                    <input
                    type="text"
                    placeholder='Course  Tag'
                    className='form-control'
                    value={courseData.seo.title}
                    onChange={(e) => handleChange('seo.title', e.target.value)}
                    />
                    </div>
                    <div className="col-12 col-md-3">
                    <label htmlFor="" className="form-label">description</label>
                    <input
                    type="text"
                    placeholder='seo description'
                    className='form-control'
                    value={courseData.seo.description}
                    onChange={(e) => handleChange('seo.description', e.target.value)}
                    />
                    </div>
                    <div className="col-12 col-md-3">
                    <label htmlFor="" className="form-label">Keywords</label>
                    <input
                    type="text"
                    placeholder='Seo Keywords'
                    className='form-control'
                    value={courseData.seo.keywords}
                    onChange={(e) => handleChange('seo.keywords', e.target.value)}
                    />
                    </div>
                    <div className="col-12 col-md-3">
                    <label htmlFor="" className="form-label">H1 Tags</label>
                    <input
                    type="text"
                    placeholder='seo h1 tags'
                    className='form-control'
                    value={courseData.seo.Tag_H1}
                    onChange={(e) => handleChange('seo.Tag_H1', e.target.value)}
                    />
                    </div>
                    <div className="col-12 col-md-3">
                    <label htmlFor="" className="form-label">Canonical URL</label>
                    <input
                    type="text"
                    placeholder='Course  Tag'
                    className='form-control'
                    value={courseData.seo.canonical_url}
                    onChange={(e) => handleChange('seo.canonical_url', e.target.value)}
                    />
                    </div>
                </div>
                <div className="row">
                    <h1>Course Details</h1>
                    <div className="col-12 col-md-3">
                    <label htmlFor="" className="form-label">Title</label>
                    <input
                    type="text"
                    placeholder='Course  Tag'
                    className='form-control'
                    value={courseData.details.Instructor}
                    onChange={(e) => handleChange('details.Instructor', e.target.value)}
                    />
                    </div>
                    <div className="col-12 col-md-3">
                    <label htmlFor="" className="form-label">Duration</label>
                    <input
                    type="text"
                    placeholder='Course Duration'
                    className='form-control'
                    value={courseData.details.Duration}
                    onChange={(e) => handleChange('details.Duration', e.target.value)}
                    />
                    </div>
                    <div className="col-12 col-md-3">
                    <label htmlFor="" className="form-label">admisionStart</label>
                    <input
                    type="text"
                    placeholder='Seo Keywords'
                    className='form-control'
                    value={courseData.details.admisionStart}
                    onChange={(e) => handleChange('details.admisionStart', e.target.value)}
                    />
                    </div>
                 
                   
                </div>
            </div>
        <div className="col-12">
            <label htmlFor="" className="form-label">Course tag</label>
            <input
              type="text"
              placeholder='Course  Tag'
              className='form-control'
              value={courseData.tag}
              onChange={(e) => handleChange('tag', e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Course Name</label>
            <input
              type="text"
              placeholder='Course Name'
              className='form-control'
              value={courseData.courseName}
              onChange={(e) => handleChange('courseName', e.target.value)}
            />
          </div>
          <div className="col-12">
          <label htmlFor="" className="form-label">Brocher Link</label>
            <input
              type="text"
              placeholder='Brochure Link'
              className='form-control'
              value={courseData.BrocherLink}
              onChange={(e) => handleChange('BrocherLink', e.target.value)}
            />
          </div>
          <div className="col-12">
          <label htmlFor="" className="form-label">Course Image Url</label>
            <input
              type="text"
              placeholder='course Image'
              className='form-control'
              value={courseData.courseImage}
              onChange={(e) => handleChange('courseImage', e.target.value)}
            />
          </div>
          <div className="col-12">
          <label htmlFor="" className="form-label">Hero Subtitle</label>
            <input
              type="text"
              placeholder='Hero Subtitle'
              className='form-control'
              value={courseData.heroSubtitle}
              onChange={(e) => handleChange('heroSubtitle', e.target.value)}
            />
          </div>
          <div className="col-12">
          <label htmlFor="" className="form-label">Course Description</label>
            <ReactQuill
              value={courseData.courseDescription}
              onChange={(value) => handleChange('courseDescription', value)}
              className='form-control p-0 border-0'
            />
          </div>
          <div className="col-12">
          <label htmlFor="" className="form-label">Course Certification</label>
            <ReactQuill
              value={courseData.certification}
              onChange={(value) => handleChange('certification', value)}
              className='form-control p-0 border-0'
            />
          </div>
          <div className="col-12">
          <label htmlFor="" className="form-label">Course Course for</label>
            {/* <input
              type="text"
              placeholder='Course For'
              className='form-control'
              value={courseData.courseFor}
              onChange={(e) => handleChange('courseFor', e.target.value)}
            /> */}
             <ReactQuill
              value={courseData.courseFor}
              onChange={(value) => handleChange('courseFor', value)}
              className='form-control p-0 border-0'
            />
          </div>
          <div className="col-12">
          <label htmlFor="" className="form-label">Designation</label>
            <ReactQuill
              value={courseData.Designation}
              onChange={(value) => handleChange('Designation', value)}
              className='form-control p-0 border-0'
            />
          </div>
          <div className="col-12">
          <label htmlFor="" className="form-label">Annual Salary description</label>
            <input
              type="text"
              placeholder='Annual Salary'
              className='form-control'
              value={courseData.AnnualSalary}
              onChange={(e) => handleChange('AnnualSalary', e.target.value)}
            />
          </div>
          <div className="col-12">
          <label htmlFor="" className="form-label">Course Points</label>
            <ReactQuill
              value={courseData.coursePoints}
              onChange={(value) => handleChange('coursePoints', value)}
              className='form-control p-0 border-0'
            />
          </div>
          <div className="col-12">
          <label htmlFor="" className="form-label">Course Benifits</label>
            <ReactQuill
              value={courseData.Benifits}
              onChange={(value) => handleChange('Benifits', value)}
              className='form-control p-0 border-0'
            />
          </div>
        </div>
      </div>
      
      {/* <div className="faq bg-white p-3 mb-4 border">
        <h2 className='fs-3 mb-4'>FAQs</h2>
        {courseData.faqs.map((faq, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Question"
              className='form-control'
              value={faq.question}
              onChange={(e) => handleChange(`faqs[${index}].question`, e.target.value)}
            />
            <input
              type="text"
              placeholder="Answer"
              className='form-control'
              value={faq.answer}
              onChange={(e) => handleChange(`faqs[${index}].answer`, e.target.value)}
            />
          </div>
        ))}
        <button className='main-btn' onClick={handleAddFAQ}>Add FAQ</button>
      </div> */}
       <div className="module bg-white p-3 mb-4 border">
     <h2 className='fs-3  mb-4'>FAQs</h2>
      {courseData.faqs.map((faq, index) => (
  <div key={index}>
    <label htmlFor="faq" className='form-label'>frequently asked question</label>
    <input
      type="text"
      placeholder="Question"
      className='form-control'
      value={faq.question}
      onChange={(e) =>
        setCourseData((prevData) => ({
          ...prevData,
          faqs: prevData.faqs.map((item, i) =>
            i === index ? { ...item, question: e.target.value } : item
          ),
        }))
      }
    />
    <textarea
      type="text"
      placeholder="Answer"
      value={faq.answer}
      className='form-control'
      onChange={(e) =>
        setCourseData((prevData) => ({
          ...prevData,
          faqs: prevData.faqs.map((item, i) =>
            i === index ? { ...item, answer: e.target.value } : item
          ),
        }))
      }
    />
  </div>
))}

      <button  className='main-btn' onClick={handleAddFAQ}>Add FAQ</button>

     </div>

     <div className="module bg-white p-3 mb-4 border">
     <h2 className='fs-3  mb-4'>Modules</h2>
      {courseData.modules.map((module, index) => (
  <div key={index}>
    <label htmlFor="module" className='form-label'>modules</label>
    <input
      type="text"
      placeholder="Title"
      className='form-control'
      value={module.title}
      onChange={(e) =>
        setCourseData((prevData) => ({
          ...prevData,
          modules: prevData.modules.map((item, i) =>
            i === index ? { ...item, title: e.target.value } : item
          ),
        }))
      }
    />
    <textarea
      type="text"
      placeholder="Description"
      value={module.description}
      className='form-control'
      onChange={(e) =>
        setCourseData((prevData) => ({
          ...prevData,
          modules: prevData.modules.map((item, i) =>
            i === index ? { ...item, description: e.target.value } : item
          ),
        }))
      }
    />
  </div>
))}

      <button  className='main-btn' onClick={handleAddModule}>Add Module</button>

     </div>

     <div className="faq bg-white p-3 mb-4 border">
     <h2 className='fs-3  mb-4'>Programming Languges</h2>
      {courseData.programmingLanguages.map((language, index) => (
  <div key={index}>
    <label htmlFor="programmingLanguages" className='form-label'>programming Languages</label>
    <input
      type="text"
      placeholder="name"
      className='form-control'
      value={language.name}
      onChange={(e) =>
        setCourseData((prevData) => ({
          ...prevData,
          programmingLanguages: prevData.programmingLanguages.map((item, i) =>
            i === index ? { ...item, name: e.target.value } : item
          ),
        }))
      }
    />
    <textarea
      type="text"
      placeholder="programmingLanguages image"
      value={language.image}
      className='form-control'
      onChange={(e) =>
        setCourseData((prevData) => ({
          ...prevData,
          programmingLanguages: prevData.programmingLanguages.map((item, i) =>
            i === index ? { ...item, image: e.target.value } : item
          ),
        }))
      }
    />
  </div>
))}

      <button  className='main-btn' onClick={handleAddLanguage}>Add Language</button>

     </div>

      <button onClick={handleUpload} className='main-btn bg-dark'>Upload Course</button>
      
    </div>
  );
};

export default Subcourses;
