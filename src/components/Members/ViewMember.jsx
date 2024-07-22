import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './style.css'

function ViewMember() {
    const [user, setUser] = useState([]);
    const {id} = useParams()

    useEffect(() => {
      

        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/membership/member/${id}`);
            setUser(response.data.member);
            console.log(response.data.member)
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // const handleVerifyMembership = async (userId) => {
    //     try {
    //         await axios.put('http://localhost:5000/api/admin/verify-membership', { userId, isMembershipVerified: true });
    //         // Refresh user data after verification
    //         fetchUsers();
            
    //     } catch (error) {
    //         console.error('Error verifying membership:', error);
    //     }
    // };
  return (
    <div className='view-member'>
      {
        user.isMembershipVerified ?(
            <h1 className="fs-2"> <i class="bi bi-check-circle-fill display-3 text-success"></i> Member Verified</h1>
        ):(
            <h1 className="fs-2"> <i class="bi bi-check-circle-fill display-3 text-danger"></i> Member not Verified</h1>
        )
      }
      <hr />

      <div className="container">
      <h2 className='mb-3'>User Details</h2>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Username: </label>
            <span>{user.username}</span>
          </div>
          <div className="mb-3">
            <label className="form-label">Name: </label>
            <span>{user.name}</span>
          </div>
          <div className="mb-3">
            <label className="form-label">Email: </label>
            <span>{user.email}</span>
          </div>
          <div className="mb-3">
            <label className="form-label">Official Number: </label>
            <span>{user.officialNumber}</span>
          </div>
          <div className="mb-3">
            <label className="form-label">Official Address: </label>
            <span>{user.officialAddress}</span>
          </div>
          <div className="mb-3">
            <label className="form-label">Residential Address: </label>
            <span>{user.residentialAddress}</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Designation: </label>
            <span>{user.designation}</span>
          </div>
          <div className="mb-3">
            <label className="form-label">Unit: </label>
            <span>{user.unit}</span>
          </div>
          <div className="mb-3">
            <label className="form-label">Gender: </label>
            <span>{user.gender}</span>
          </div>
          <div className="mb-3">
            <label className="form-label">KGID No: </label>
            <span>{user.kgidNo}</span>
          </div>
          <div className="mb-3">
            <label className="form-label">Working Status: </label>
            <span>{user.workingStatus}</span>
          </div>
          <div className="mb-3">
            <label className="form-label">Date of Birth: </label>
            <span>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : ''}</span>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div className="text-end p-3">
        <button className="btn btn-danger">Delete Member</button>
    </div>
    </div>
  )
}

export default ViewMember