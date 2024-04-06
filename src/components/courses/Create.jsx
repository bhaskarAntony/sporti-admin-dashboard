// UploadData.js
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createCourse } from '../../Data/apiService';

const UploadData = () => {
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
    subCourses:[],
    Benifits:'',
    Designation:'',
    AnnualSalary:'',
    faqs: [],
    languages: [],
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

  const handleCertificationChange = (certification) => {
    setCourseData({ ...courseData, certification });
  };
  const handleCourseDescriptionChange = (courseDescription) => {
    setCourseData({ ...courseData, courseDescription });
  };
  const handleDesignationChange = (designation) => {
    setCourseData({ ...courseData, designation });
  };
  const handleSalaryDescriptionChange = (AnnualSalary) => {
    setCourseData({ ...courseData, AnnualSalary });
  };
  const handleCourseHeroPointsChange = (courseHeroPoints) => {
    setCourseData({ ...courseData, courseHeroPoints });
  };
  
  const handleCourseForChange = (courseFor) => {
    setCourseData({ ...courseData, courseFor });
  };

  const handleAddFAQ = () => {
    setCourseData((prevData) => ({
      ...prevData,
      faqs: [...prevData.faqs, { question: '', answer: '' }],
    }));
  };
  const handleAddInstructor = () => {
    setCourseData((prevData) => ({
      ...prevData,
      instructors: [...prevData.faqs, { name: '', email: '', enrolled:null }],
    }));
  };

  // const handleAddModule = () => {
  //   setCourseData((prevData) => ({
  //     ...prevData,
  //     modules: [...prevData.modules, { title: '', topics: '' }],
  //   }));
  // };

  const handleAddProgrammingLanguage = () => {
    setCourseData((prevData) => ({
      ...prevData,
      languages: [
        ...prevData.languages,
        { name: '', image: '' },
      ],
    }));
  };

  const handleUpload = async () => {
    console.log(courseData)
    // try {
    //   const response = await createCourse(courseData);
    //   alert('Course uploaded successfully:', response);
    // } catch (error) {
    //   alert('Error uploading course:', error.message);
    // }
    // console.log(courseData)
  };

  return (
    <div className='course-upload container-fluid p-3 light-bg'>
      <div className="course-details bg-white mb-4 p-3 border">
      <h2>Course Details</h2>
      <div className="row">
        <div className="col-12 col-md-6 col-lg-3">
        {/* <label className='form-label'>
        Course Name:
        </label> */}
        <input
          type="text"
          placeholder='Course Name'
          className='form-control'
          value={courseData.courseName}
          onChange={(e) =>
            setCourseData({ ...courseData, courseName: e.target.value })
          }
        />
      
        </div>
        <div className="col-12 col-md-6 col-lg-3">
        {/* <label className='form-label'>
      courseDuration:
      </label> */}
        <input
          type="text"
          placeholder='BrocherLink'
          className='form-control'
          value={courseData.BrocherLink}
          onChange={(e) =>
            setCourseData({ ...courseData, BrocherLink: e.target.value })
          }
        />
      
        </div>
        <div className="col-12 col-md-6 col-lg-3">
        {/* <label className='form-label'>
      courseDuration:
      </label> */}
        <input
          type="text"
          placeholder='Course Enrolled'
          className='form-control'
          value={courseData.enrolledStudents}
          onChange={(e) =>
            setCourseData({ ...courseData, enrolledStudents: e.target.value })
          }
        />
       
        </div>
        <div className="col-12 col-md-6 col-lg-3">
        {/* <label className='form-label'>
      modeOfTraining:
      </label> */}
        <input
          type="text"
          placeholder='Traning Mode'
          className='form-control'
          value={courseData.modeOfTraining}
          onChange={(e) =>
            setCourseData({ ...courseData, modeOfTraining: e.target.value })
          }
        />
      
        </div>
        <div className="col-12 col-md-6 col-lg-3">
        {/* <label className='form-label'>
      courseVideo:
      </label>  */}
        <input
          type="text"
          placeholder='Course Video URL'
          className='form-control'
          value={courseData.courseVideo}
          onChange={(e) =>
            setCourseData({ ...courseData, courseVideo: e.target.value })
          }
        />
      
        </div>
        <div className="col-12 col-md-6 col-lg-3">
        {/* <label className='form-label'>
      minSalary:
      </label>  */}
        <input
          type="text"
          placeholder='Starting Salary'
          className='form-control'
          value={courseData.minSalary}
          onChange={(e) =>
            setCourseData({ ...courseData, minSalary: e.target.value })
          }
        />
     
        </div>
        <div className="col-12 col-md-6 col-lg-3">
        {/* <label className='form-label'>
      HighestSalary:
      </label> */}
        <input
          type="text"
          placeholder='Highest Salary'
          className='form-control'
          value={courseData.HighestSalary}
          onChange={(e) =>
            setCourseData({ ...courseData, HighestSalary: e.target.value })
          }
        />
      
        </div>
        <div className="col-12 col-md-6 col-lg-3">
        {/* <label className='form-label'>
      BatchStarting:
      </label>  */}
        <input
          type="text"
          placeholder='Next Batch Starting'
          className='form-control'
          value={courseData.BatchStarting}
          onChange={(e) =>
            setCourseData({ ...courseData, BatchStarting: e.target.value })
          }
        />
      
        </div>
        <div className="col-12 col-md-6 col-lg-3">
        {/* <label className='form-label'>
      heroTitle:
      </label> */}
        <input
          type="text"
          placeholder='Hero Title'
          className='form-control'
          value={courseData.heroTitle}
          onChange={(e) =>
            setCourseData({ ...courseData, heroTitle: e.target.value })
          }
        />
      
        </div>
        <div className="col-12 col-md-6 col-lg-3">
        {/* <label className='form-label'>
      heroSubtitle:
      </label> */}
        <input
          type="text"
          placeholder='Hero Subtitle'
          className='form-control'
          value={courseData.heroSubtitle}
          onChange={(e) =>
            setCourseData({ ...courseData, heroSubtitle: e.target.value })
          }
        />
      
        </div>
        <div className="col-12 col-md-6 col-lg-3">
        {/* <label className='form-label'>
      courseImage:
      </label> */}
        <input
          type="text"
          placeholder='Course Image'
          className='form-control'
          value={courseData.courseImage}
          onChange={(e) =>
            setCourseData({ ...courseData, courseImage: e.target.value })
          }
        />
     
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
        <label className='form-label'>
      Course Description (SEO):
      </label>
        {/* <input
          type="text"
          value={courseData.courseDescription}
          onChange={(e) =>
            setCourseData({ ...courseData, courseDescription: e.target.value })
          }
        /> */}
         <ReactQuill  value={courseData.courseDescription} onChange={handleCourseDescriptionChange} className='form-control p-0 border-0' />
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
        <label className='form-label'>
      Certification (SEO):
      </label>
        {/* <input
          type="text"
          value={courseData.certification}
          onChange={(e) =>
            setCourseData({ ...courseData, certification: e.target.value })
          }
        /> */}
          <ReactQuill  value={courseData.certification} onChange={handleCertificationChange} className='form-control p-0 border-0' />
      
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
        <label className='form-label'>
      Course For (SEO):
      </label>
        {/* <input
          type="text"
          value={courseData.courseFor}
          onChange={(e) =>
            setCourseData({ ...courseData, courseFor: e.target.value })
          }
        /> */}
        <ReactQuill  value={courseData.courseFor} onChange={handleCourseForChange} className='form-control  p-0 border-0' />
      
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
        <label className='form-label'>
      Designation (SEO):
      </label>
        {/* <input
          type="text"
          value={courseData.designation}
          onChange={(e) =>
            setCourseData({ ...courseData, designation: e.target.value })
          }
        /> */}
        <ReactQuill  value={courseData.Designation} onChange={handleDesignationChange} className='form-control p-0 border-0' />
      
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
        <label className='form-label'>
      Salary Description (SEO):
      </label>
        {/* <input
          type="text"
          value={courseData.salaryDescription}
          onChange={(e) =>
            setCourseData({ ...courseData, salaryDescription: e.target.value })
          }
        /> */}
        <ReactQuill  value={courseData.AnnualSalary} onChange={handleSalaryDescriptionChange} className='form-control p-0 border-0' />
     
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6">

        <label className='form-label'>
      Course Hero Points (SEO):
      </label>
        {/* <input
          type="text"
          value={courseData.courseHeroPoints}
          onChange={(e) =>
            setCourseData({ ...courseData, courseHeroPoints: e.target.value })
          }
        /> */}
        <ReactQuill  value={courseData.courseHeroPoints} onChange={handleCourseHeroPointsChange} className='form-control p-0 border-0' />
      
        </div>


      </div>
      </div>
      
 
     
    
      
     
     
      
      
      {/* Add other course details input fields as needed */}

     <div className="faq bg-white p-3 mb-4 border">
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
    {/* <div className="module bg-white p-3 mb-4 border">
    <h2 className='fs-3 mb-4'>Modules</h2>
      {courseData.modules.map((module, index) => (
  <div key={index}>
    <label htmlFor="module" className="form-label">Modules</label>
    <input
      type="text"
      placeholder="Module Title"
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
    <ReactQuill
    className='form-control  p-0 border-0'
      value={module.topics}
      onChange={(value) =>
        setCourseData((prevData) => ({
          ...prevData,
          modules: prevData.modules.map((item, i) =>
            i === index ? { ...item, topics: value } : item
          ),
        }))
      }
    />
  </div>
))}

      <button  onClick={handleAddModule} className='main-btn'><i class="bi bi-plus-lg mx-2"></i>Add Module</button>
    </div> */}

<div className="languages bg-white p-3 mb-4 border">
<h2 className='fs-3 mb-4'>Programming Languages</h2>
      {courseData.languages.map((language, index) => (
  <div key={index}>
    <div className="row">
        <div className="col-sm-12 col-md-6">
        <input
      type="text"
      className='form-control'
      placeholder="Language Name"
      value={language.name}
      onChange={(e) =>
        setCourseData((prevData) => ({
          ...prevData,
          programmingLanguages: prevData.programmingLanguages.map(
            (item, i) =>
              i === index ? { ...item, name: e.target.value } : item
          ),
        }))
      }
    />
        </div>
        <div className="col-sm-12 col-md-6">
         
    <input
      type="text"
      className='form-control'
      placeholder="Image URL"
      value={language.image}
      onChange={(e) =>
        setCourseData((prevData) => ({
          ...prevData,
          programmingLanguages: prevData.programmingLanguages.map(
            (item, i) =>
              i === index ? { ...item, image: e.target.value } : item
          ),
        }))
      }
    />   
        </div>
    </div>
   
  </div>
))}
<button className='main-btn' onClick={handleAddProgrammingLanguage}>
<i class="bi bi-plus-lg mx-2"></i> Add Programming Language
</button>
</div>

<div className="intructor bg-white p-3 mb-4">
    <h1 className='fs-3 mb-4'>Instructor Details</h1>
{courseData.instructors.map((instructor, index) => (
  <div key={index} >
    <label htmlFor="instructor" className="form-label">Instructor Details</label>
    <div className="row">
        <div className="col-sm-12 col-md-4">
        <input
      type="text"
      className='form-control'
      placeholder="Instructor Name"
      value={instructor.name}
      onChange={(e) =>
        setCourseData((prevData) => ({
          ...prevData,
          instructors: prevData.instructors.map((item, i) =>
            i === index ? { ...item, name: e.target.value } : item
          ),
        }))
      }
    />
        </div>
        <div className="col-sm-12 col-md-4">
        <input
      type="text"
      className='form-control'
      placeholder="Instructor Email"
      value={instructor.email}
      onChange={(e) =>
        setCourseData((prevData) => ({
          ...prevData,
          instructors: prevData.instructors.map((item, i) =>
            i === index ? { ...item, email: e.target.value } : item
          ),
        }))
      }
    />       
        </div>
        <div className="col-sm-12 col-md-4">
        <input
      type="text"
      className='form-control'
      placeholder="Enrolled"
      value={instructor.enrolled}
      onChange={(e) =>
        setCourseData((prevData) => ({
          ...prevData,
          instructors: prevData.instructors.map((item, i) =>
            i === index ? { ...item, enrolled: e.target.value } : item
          ),
        }))
      }
    />    
        </div>
    </div>
   
  

  </div>
))}
<button onClick={handleAddInstructor} className='main-btn'><i class="bi bi-plus-lg mx-2"></i> Add Instructor</button>
</div>



      <button onClick={handleUpload} className='main-btn bg-dark'>Upload Course</button>
      
    </div>
  );
};

export default UploadData;
