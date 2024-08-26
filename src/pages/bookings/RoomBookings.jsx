import TooltipTo from '@mui/material/Tooltip';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../../components/popup/Loading';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import { BookingContext } from '../../components/hooks/BookingContext';

function RoomBookings() {
    const { Contextbookings, isloading, error, fetchBookings } = useContext(BookingContext);
   const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewDetails, setViewDetails] = useState(null)
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [searchQuery, setSearchQuery] = useState({
        recents:'',
        pending:'',
        confirmed:'',
        rejected:''
    });

    // const filteredData = data.filter(item =>
    //     item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     item.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    if (error){
        toast.error('No bookings data found please try again later')
    }

    useEffect(()=>{
        setData(Contextbookings.filter((item)=>item.serviceName == "Room Booking"));
    }, [Contextbookings])

    const navigate = useNavigate()
    // const fetchData = () =>{
    //     axios.get('https://sporti-backend-live-2.onrender.com/api/sporti/service/bookings')
    //     .then(response => {
    //         setLoading(false);
    //         setData(response.data.filter((item)=>item.serviceName == "Room Booking"));
    //         console.log(response.data.reverse());
            
    //         // processChartData(response.data);
    //     })
    //     .catch(error => {
    //         setLoading(false)
    //         console.error('There was an error fetching the data!', error);
    //     });
    //    }
    //    fetchData()

       const resendSMS = async(id)=>{
        await axios.get(`https://sporti-backend-live-p00l.onrender.com/api/sporti/service/send/room/sms/${id}`)
        .then((res)=>{
         console.log(res);
         
        })
        .catch((err)=>{
         console.log(err);
         
        })
        }

        const handleRejectBooking = async () => {
            setLoading(true);
            try {
                await axios.patch(`https://sporti-backend-live-p00l.onrender.com/api/sporti/service/${selectedBooking._id}/reject`, { rejectionReason });
                fetchBookings(); // Refresh bookings after rejection
                 setShowModal(false)
                setLoading(false);
                toast.warning('Rejected the request');
            } catch (error) {
                setLoading(false);
                toast.error('Error', error.message);
                console.error('Error:', error);
            }
        };
    
        const handleShowModal = (booking) => {
            setSelectedBooking(booking);
            setShowModal(true);
        };


        const deleteHandler = (applicationNO) =>{
            setLoading(true)
            axios.delete(`https://sporti-backend-live-p00l.onrender.com/api/sporti/service/delete/booking/${applicationNO}`)
            .then((res)=>{
                setLoading(false)
                toast.success('booking deleted');
                fetchBookings()
            })
            .catch((err)=>{
                setLoading(false)
                toast.error(err.message)
            })
        }
        if(isloading){
            return <Loading/>
        }


        const gotoViewDetails = (formData) => {
            navigate('/view/room/details', { state: {data:formData } });
      }

      const handleConfirmBooking = async (formData) => {
        console.log(formData);
        
        if(formData.serviceName == "Room Booking"){
             navigate(`/select/room`, { state: {data:formData } })
        }else{
         setLoading(true);
         try {
             await axios.patch(`https://sporti-backend-live-2.onrender.com/api/sporti/service/${formData._id}/confirm`);
             // fetchBookings(); // Refresh bookings after confirmation
             setLoading(false);
             toast.success('Accepted the request');
             // window.location.reload();
             fetchBookings();
         } catch (error) {
 
 
             setLoading(false);
             toast.success('Accepted the request');
             console.error('Error:', error);
         }
        }
     };
  return (
    <div className='bg-light container-fluid'>
      <div className="row">
                <div className="col-md-12">
                    <div className="all-bookings p-3 p-md-5">
                        <h1 className="fs-5">Recent Bookings</h1>
                        <p className="fs-6 text-secondary">Here you can find all user with bookings</p>
                      <div className="table-container">
                      <table>
                        <tr>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Officers Category</th>
                            <th>Service</th>
                            <th>Action</th>
                        </tr>
                          {
                            data.map((item, index)=>(
                              
                                
                                <tr>
                                    {/* <td><Avatar sx={{ bgcolor: "green" }}>{(item.username)}</Avatar></td> */}
                                    <td><img src="https://www.uniquemedical.com.au/wp-content/uploads/2024/03/Default_pfp.svg.png" alt="" /></td>
                                    <td>{item.username}</td>
                                    <td>{item.serviceName =="Room Booking"?item.roomType:item.serviceType}</td>
                                    <td>{item.serviceName}</td>
                                    <td className=''>
                                  <div className="d-flex gap-3 flex-wrap h-100">
                                  {/* <i class="bi bi-pencil-fill fs-4 text-success"></i> */}
                                 <TooltipTo title="view booking">
                                 <button className="btn btn-dark btn sm" onClick={()=>gotoViewDetails(item)}>
                                  <i class="bi bi-eye-fill" ></i>
                                  </button>
                                 </TooltipTo>
                                   <button className="btn btn-danger btn-sm" onClick={()=>deleteHandler(item.applicationNo)}> <i class="bi bi-trash" ></i></button>
                                  </div>
                                    </td>
                                </tr>
                            ))
                        }
                      </table>
                      </div>
                    </div>
                </div>
                <div className="col-md-6 mt-4">
                    <div className="all-bookings p-3 p-md-5">
                        <h1 className="fs-5">Pending Bookings</h1>
                        <h1 className="fs-6">   {data.filter((item)=>item.status=="pending").length} pending Bookings</h1>
                        <p className="fs-6 text-secondary">Here you can find all Pending bookings</p>
                     
                    <div className="table-container">
                    <table>
                        <tr>
                            <th>Profile</th>
                            <th>Name</th>
                            {/* <th>Cadre</th> */}
                            <th>Service</th>
                            <th>Action</th>
                        </tr>
                          {
                            data.map((item, index)=>(
                                item.status == "pending"?(
                                    <tr>
                                    {/* <td><Avatar sx={{ bgcolor: "green" }}>{(item.username)}</Avatar></td> */}
                                    <td><img src="https://www.uniquemedical.com.au/wp-content/uploads/2024/03/Default_pfp.svg.png" alt="" /></td>
                                    <td>{item.username}</td>
                                    {/* <td>{item.officerCadre}</td> */}
                                    <td>{item.serviceName}</td>
                                    <td className=''>
                                   <div className="d-flex gap-2">
                                  <TooltipTo title="confirm booking">
                                  <button className="btn btn-success btn-sm" onClick={()=>handleConfirmBooking(item)}><i class="bi bi-check-lg"></i></button>
                                  </TooltipTo>
                                   <TooltipTo title="reject booking">
                                   <button className="btn btn-danger btn-sm"  onClick={() => handleShowModal(item)}><i class="bi bi-x-lg"></i></button>
                                   </TooltipTo>
                                   <TooltipTo title="Send SMS">
                                   <button className="btn btn-dark btn-sm"  onClick={() => handleShowModal(item)}><i class="bi bi-send"></i></button>
                                   </TooltipTo>
                                   </div>
                                    </td>
                                </tr>
                                ):(null)
                            ))
                        }
                      </table>
                    </div>
                    </div>
                </div>
                <div className="col-md-6 mt-4">
                    <div className="all-bookings p-3 p-md-5">
                        <h1 className="fs-5">Confirmed Bookings</h1>
                        <h1 className="fs-6">   {data.filter((item)=>item.status=="confirmed").length} confirmed Bookings</h1>
                        <p className="fs-6 text-secondary">Here you can find all Confirmed bookings</p>
                        <hr />
                     {
                        data.filter((item)=>item.status == "confirmed").length !=0?(
                           <div className="table-container">
                             <table>
                            <tr>
                                <th>Profile</th>
                                <th>Name</th>
                                {/* <th>Cadre</th> */}
                                <th>Service</th>
                                <th>Action</th>
                            </tr>
                              {
                                data.map((item, index)=>(
                                    item.status == "confirmed"?(
                                        <tr>
                                        {/* <td><Avatar sx={{ bgcolor: "green" }}>{(item.username)}</Avatar></td> */}
                                        <td><img src="https://www.uniquemedical.com.au/wp-content/uploads/2024/03/Default_pfp.svg.png" alt="" /></td>
                                        <td>{item.username}</td>
                                        {/* <td>{item.officerCadre}</td> */}
                                        <td>{item.serviceName}</td>
                                        <td className=''>
                                        <div className="d-flex gap-2 flex-nowrap h-100">
                                        <TooltipTo title="Send SMS">
                                        <button className="btn btn-dark btn-sm"  onClick={() => resendSMS(item._id)}><i class="bi bi-send"></i></button>
                                        </TooltipTo>
                                        <TooltipTo title="send reject booking">    <button className="btn btn-success btn-sm"  onClick={() => handleShowModal(item)}>&#8377;<i class="bi bi-check"></i></button></TooltipTo>
                                        <TooltipTo title="delete confirmed booking"> <button className="btn btn-danger btn-sm" onClick={()=>deleteHandler(item.applicationNo)}><i class="bi bi-trash"></i></button></TooltipTo>
                                       
                                        </div>
                                        </td>
                                    </tr>
                                    ):(null)
                                ))
                            }
                          </table>
                           </div>
                        )
                        :(
                            <img src="https://img.freepik.com/premium-vector/access-documents-that-are-cloud-storage-is-closed-data-protection-flat-vector-illustration_124715-1657.jpg?w=740" className='w-100' alt="" />
                        )
                     }
                    </div>
                </div>
                <div className="col-md-6 mt-4">
                    <div className="all-bookings p-3 p-md-5">
                        <h1 className="fs-5">Rejected Bookings</h1>
                        <h1 className="fs-6">   {data.filter((item)=>item.status=="rejected").length} Rejected Bookings</h1>
                        <p className="fs-6 text-secondary">Here you can find all Rejected bookings</p>
                        <hr />
                     {
                        data.filter((item)=>item.status == "rejected").length !=0?(
                            <div className="table-container">
                                     <table>
                            <tr>
                                <th>Profile</th>
                                <th>Name</th>
                                {/* <th>Cadre</th> */}
                                <th>Service</th>
                                <th>Action</th>
                            </tr>
                              {
                                data.map((item, index)=>(
                                    item.status == "rejected"?(
                                        <tr>
                                        {/* <td><Avatar sx={{ bgcolor: "green" }}>{(item.username)}</Avatar></td> */}
                                        <td><img src="https://www.uniquemedical.com.au/wp-content/uploads/2024/03/Default_pfp.svg.png" alt="" /></td>
                                        <td>{item.username}</td>
                                        {/* <td>{item.officerCadre}</td> */}
                                        <td>{item.serviceName}</td>
                                        <td className=''>
                                       <div className="d-flex gap-2 flex-nowrap">
                                     
                                      
                                     
                                      <TooltipTo title="send reject sms">   <button className="btn btn-success btn-sm" onClick={()=>handleConfirmBooking(item._id)}><i class="bi bi-check-lg"></i></button></TooltipTo>
                                      <TooltipTo title="delete rejected booking"> <button className="btn btn-danger btn-sm" onClick={()=>deleteHandler(item.applicationNo)}><i class="bi bi-trash"></i></button></TooltipTo>
                                      <TooltipTo title="Send SMS">
                                   <button className="btn btn-dark btn-sm"  onClick={() => handleShowModal(item)}><i class="bi bi-send"></i></button>
                                   </TooltipTo>
                                       </div>
                                        </td>
                                    </tr>
                                    ):(null)
                                ))
                            }
                          </table>
                            </div>
                        )
                        :(
                            <img src="https://img.freepik.com/premium-vector/access-documents-that-are-cloud-storage-is-closed-data-protection-flat-vector-illustration_124715-1657.jpg?w=740" className='w-100' alt="" />
                        )
                     }
                    </div>
                </div>
            </div>


            <Modal show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{viewDetails ? 'Booking Details' : 'Reject Booking'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewDetails ? (
                        <div>
                            <p><strong>Service Type:</strong> {viewDetails.serviceType}</p>
                            <p><strong>Service Name:</strong> {viewDetails.serviceName}</p>
                            <p><strong>Date:</strong> {new Date(viewDetails.eventdate).toLocaleDateString()}</p>
                            <p><strong>Total Cost:</strong> {viewDetails.totalCost}</p>
                        </div>
                    ) : (
                        <Form.Group>
                            <Form.Label>Rejection Reason</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShowModal(false)}>Close</Button>
                    {!viewDetails && <Button variant="primary" onClick={handleRejectBooking}>Reject</Button>}
                </Modal.Footer>
            </Modal>
    </div>
  )
}

export default RoomBookings