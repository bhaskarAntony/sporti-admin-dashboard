import axios from 'axios';
import React, { useEffect, useState } from 'react'

function All() {
    const [allCourses, setAllCourses] = useState([])
    const [loading, setLoading] = useState(true)
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


  return (
    <div className='bg-white mt-3'>
        <span className="fs-5 p-3 text-warning d-block">{allCourses?.length} Courses</span>
       <ul className='all-courses p-0'>
       {
            allCourses.map((item, index)=>(
                <li className='course-item rounded-3 d-flex justify-content-between align-items-center p-2 py-4 shadow-sm border mb-3' key={index}>
                    <span className='fs-4'>{index+1} {item.courseName}</span>
                    <div className="icons d-flex gap-2 fs-4">
                   {
                    item.subCourses.length!=0?(
                        <a href={`/subcourses/${item._id}`}><i class="bi bi-eye  text-primary"></i></a>
                    ):(
                        <p><i class="bi bi-eye-slash  text-muted"></i></p>
                    )
                   }
                    <i class="bi bi-trash3 text-danger"></i>
                    <a href={`update/course/${item._id}`}><i class="bi bi-pencil-square text-success"></i></a>
                    
                    </div>
                </li>
            ))
        }
       </ul>
    </div>
  )
}

export default All