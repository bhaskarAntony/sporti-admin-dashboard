// AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Members = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      

        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/get-user-data');
            setUsers(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleVerifyMembership = async (userId) => {
        try {
            await axios.put('http://localhost:5000/api/admin/verify-membership', { userId, isMembershipVerified: true });
            // Refresh user data after verification
            fetchUsers();
            
        } catch (error) {
            console.error('Error verifying membership:', error);
        }
    };

    return (
        <div>
            <h2 className='fs-2 text-center py-3'>Sporti Members Verification</h2>
            <table className='table table-striped mt-4'>
                <thead>
                    <tr className='table-primary'>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Membership Status</th>
                        <th>Actions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td className={user.isMembershipVerified ? 'text-success':'text-danger'}>{user.isMembershipVerified ? 'Verified' : 'Not Verified'}</td>
                            <td>
                                {!user.isMembershipVerified && (
                                    <button className='btn btn-primary' onClick={() => handleVerifyMembership(user._id)}>Verify</button>
                                )}
                            </td>
                            <td>
                              <Link to={`/members/view/${user._id}`}>  <i className='bi bi-eye'></i></Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Members;
