import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function AllSubCourses() {
    const {id} = useParams();
    const [allCourses, setAllCourses] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchAllCourses = async () => {
          try {
            const response = await axios.get(`https://comfortable-boot-fly.cyclic.app/api/allcourses/${id}`);
            setLoading(false)
            console.log(response);
            setAllCourses(response.data)
          } catch (error) {
            setLoading(false)
            console.error('Error fetching courses:', error);
          }
        };
    
        fetchAllCourses();
      }, []);


  return (
    <div className='bg-white mt-3'>
     <div className='shadow p-2 mb-4 bg-success text-white rounded-3'>
     <span className='fs-3'>{allCourses?.courseName}</span>
     </div>
     <span className="fs-5 p-3 text-warning d-block">{allCourses?.subCourses?.length} Courses</span>
       <ul className='all-courses p-0'>
       {
            allCourses?.subCourses?.map((item, index)=>(
                <li className='course-item rounded-3 d-flex justify-content-between align-items-center p-2 py-4 shadow-sm border mb-3' key={index}>
                    <span className='fs-5'>{index+1} {item?.courseName}</span>
                    <div className="icons d-flex gap-2 fs-5">
                    <p href=''><i class="bi bi-eye text-muted"></i></p>
                    <i class="bi bi-trash3 text-danger"></i>
                    <a href={`/update/${id}/subcourse/${item._id}`}><i class="bi bi-pencil-square text-success"></i></a>
                    
                    </div>
                </li>
            ))
        }
       </ul>
    </div>
  )
}

export default AllSubCourses