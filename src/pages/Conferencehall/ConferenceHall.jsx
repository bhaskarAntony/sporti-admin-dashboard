import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import Select from 'react-select';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import MainRoomBook from '../../components/Bookings/RoomBooking';
import MainFunctionHallBooking from '../../components/Bookings/ServiceBook';
import { toast } from 'react-toastify';
import Loading from '../../components/popup/Loading';
import DOMPurify from 'dompurify';
import cookies  from 'js-cookie'
import TooltipTo from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);
function sanitizeInput(input) {
    // First, sanitize HTML to prevent XSS
    let sanitized = DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });

    // Allow specific characters while removing others
    // Allow alphanumeric, space, @, ., -, _, and other specific symbols
    sanitized = sanitized.replace(/[^a-zA-Z0-9@._\- ]/g, '');

    return sanitized;
}
const ConferenceHall = () => {
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showManualBookingModal, setShowManualBookingModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [filters, setFilters] = useState({
        serviceType: null,
        serviceName: null,
        checkIn: null,
        checkOut: null,
    });
    const [monthlyUsers, setMonthlyUsers] = useState({});
    const [serviceTypes, setServiceTypes] = useState({});
    const [serviceNames, setServiceNames] = useState({});
    const [sporti, setSporti] = useState({});
    const [monthlyRevenue, setMonthlyRevenue] = useState({});
    const [totalCost, setTotalCost] = useState(0);
    const [serviceBook, setServiceBook] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewDetails, setViewDetails] = useState(null);
    const [editModal, setEditModal] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, bookings]);

    const fetchBookings = async () => {
        const token = cookies.get('token');
        try {
            const res = await axios.get('https://sporti-backend-live-p00l.onrender.com/api/sporti/service/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
            setLoading(false);
            processChartData(res.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...bookings];
        if (filters.serviceType) {
            filtered = filtered.filter(booking => booking.serviceType === filters.serviceType.value);
        }
        if (filters.serviceName) {
            filtered = filtered.filter(booking => booking.serviceName === filters.serviceName.value);
        }
        if (filters.checkIn) {
            filtered = filtered.filter(booking => new Date(booking.eventdate) >= new Date(filters.checkIn.value));
        }
        if (filters.checkOut) {
            filtered = filtered.filter(booking => new Date(booking.eventdate) <= new Date(filters.checkOut.value));
        }
        setFilteredBookings(filtered);
    };

    const clearFilters = () => {
        setFilters({
            serviceType: null,
            serviceName: null,
            checkIn: null,
            checkOut: null,
        });
    };

    const handleShowModal = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setRejectionReason('');
        setSelectedBooking(null);
    };

    const handleRejectBooking = async () => {
        setLoading(true);
        try {
            await axios.patch(`https://sporti-backend-live-2.onrender.com/api/sporti/service/${selectedBooking._id}/reject`, { rejectionReason });
            fetchBookings(); // Refresh bookings after rejection
            handleCloseModal();
            setLoading(false);
            toast.warning('Rejected the request');
        } catch (error) {
            setLoading(false);
            toast.error('Error', error.message);
            console.error('Error:', error);
        }
    };

    const handleConfirmBooking = async (bookingId) => {
        setLoading(true);
        try {
            await axios.patch(`https://sporti-backend-live-p00l.onrender.com//api/sporti/service/${bookingId}/confirm`);
            fetchBookings(); // Refresh bookings after confirmation
            setLoading(false);
            toast.success('Accepted the request');
        } catch (error) {
            setLoading(false);
            toast.error('Error', error.message);
            console.error('Error:', error);
        }
    };

    const handleViewDetails = (booking) => {
        setViewDetails(booking);
        setShowModal(true);
    };

    const handleDeleteBooking = async(bookingId) => {
        setLoading(true);
        try {
            await axios.delete(`https://sporti-backend-live-2.onrender.com/api/sporti/service/${bookingId}`);
            fetchBookings(); // Refresh bookings after deletion
            setLoading(false);
            toast.success('Deleted the booking');
        } catch (error) {
            setLoading(false);
            toast.error('Error', error.message);
            console.error('Error:', error);
        }
    };

    const handleUpdateBooking = (booking) => {
        setSelectedBooking(booking);
        setEditModal(true);
    };

    const handleEditSubmit = async () => {
        setLoading(true);
        try {
            await axios.patch(`https://sporti-backend-live-2.onrender.com/api/sporti/service/${selectedBooking._id}`, selectedBooking);
            fetchBookings(); // Refresh bookings after update
            setEditModal(false);
            setLoading(false);
            toast.success('Updated the booking');
        } catch (error) {
            setLoading(false);
            toast.error('Error', error.message);
            console.error('Error:', error);
        }
    };

    const processChartData = (data) => {
        const monthlyUsersData = {};
        const serviceTypesData = {};
        const serviceNamesData = {};
        const sportiData = {};
        const monthlyRevenueData = {};
        let totalCost = 0;

        data.forEach(item => {
            const month = new Date(item.eventdate).getMonth() + 1;
            monthlyUsersData[month] = (monthlyUsersData[month] || 0) + 1;
            serviceTypesData[item.serviceType] = (serviceTypesData[item.serviceType] || 0) + 1;
            serviceNamesData[item.serviceName] = (serviceNamesData[item.serviceName] || 0) + 1;
            sportiData[item.sporti] = (sportiData[item.sporti] || 0) + 1;
            totalCost += parseFloat(item.totalCost);
            monthlyRevenueData[month] = (monthlyRevenueData[month] || 0) + parseFloat(item.totalCost);
        });

        setMonthlyUsers(monthlyUsersData);
        setServiceTypes(serviceTypesData);
        setServiceNames(serviceNamesData);
        setSporti(sportiData);
        setTotalCost(totalCost);
        setMonthlyRevenue(monthlyRevenueData);
    };

    const generateChartData = (data, label, colors) => ({
        labels: Object.keys(data),
        datasets: [
            {
                label: label,
                data: Object.values(data),
                backgroundColor: colors,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#36A2EB'];

    const serviceTypeOptions = Array.from(new Set(bookings.map(booking => booking.serviceType))).map(serviceType => ({ value: serviceType, label: serviceType }));
    const serviceNameOptions = Array.from(new Set(bookings.map(booking => booking.serviceName))).map(serviceName => ({ value: serviceName, label: serviceName }));
    const dateOptions = Array.from(new Set(bookings.map(booking => booking.eventdate))).map(date => ({ value: date, label: new Date(date).toLocaleDateString() }));

    const renderTable = (data) => (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(data).map((key, index) => (
                    <tr key={index}>
                        <td>{key}</td>
                        <td>{data[key]}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const openServiceModal = () => setServiceBook(true);
    const closeServiceModal = () => setServiceBook(false);

    if (loading) {
        return <Loading />;
    }

    const deleteHandler = (applicationNo) =>{

    }

    return (
      <div className="bg-light p-3 p-md-5">
  <Container fluid className='all-bookings bg-light'>
  
    <div className="d-flex align-items-center justify-content-between py-4 p-2">
        <h1 className="fs-3">Booking details</h1>
      <div className="d-flex align-items-center gap-3 py-1">
      <Link to="/new/service"  className='main-btn fs-6'>Add New Event Booking</Link>
      <Link to="/new/room/booking" className='main-btn fs-6'>Add New Room Booking</Link>
      <button className="btn btn-outline-secondary"  onClick={clearFilters}>Clear Filters</button>
      </div>
    </div>
    <hr />
    <Row className="mb-4">
                <Col md={3}>
                   <div className="card border-0 p-3">
                   <Form.Group>
                        <Form.Label>Service Type</Form.Label>
                        <Select
                            value={filters.serviceType}
                            onChange={option => setFilters({ ...filters, serviceType: option })}
                            options={serviceTypeOptions}
                            placeholder="Select Service Type"
                        />
                    </Form.Group>
                   </div>
                </Col>
                <Col md={3}>
                   <div className="card border-0 p-3">
                   <Form.Group>
                        <Form.Label>Service Name</Form.Label>
                        <Select
                            value={filters.serviceName}
                            onChange={option => setFilters({ ...filters, serviceName: option })}
                            options={serviceNameOptions}
                            placeholder="Select Service Name"
                        />
                    </Form.Group>
                   </div>
                </Col>
                <Col md={3}>
                   <div className="card p-3 border-0">
                   <Form.Group>
                        <Form.Label>Check In</Form.Label>
                        <Select
                            value={filters.checkIn}
                            onChange={option => setFilters({ ...filters, checkIn: option })}
                            options={dateOptions}
                            placeholder="Select Check In Date"
                        />
                    </Form.Group>
                   </div>
                </Col>
                <Col md={3}>
                   <div className="card p-3 border-0">
                   <Form.Group>
                        <Form.Label>Check Out</Form.Label>
                        <Select
                            value={filters.checkOut}
                            onChange={option => setFilters({ ...filters, checkOut: option })}
                            options={dateOptions}
                            placeholder="Select Check Out Date"
                        />
                    </Form.Group>
                   </div>
                </Col>
                
            </Row>
    <div className="row" style={{marginTop:'230px'}}>
                <div className="col-md-12">
                    <div className="all-bookings p-3 p-md-5">
                        <h1 className="fs-5">Recent Bookings</h1>
                        <p className="fs-6 text-secondary">Here you can find all user with bookings</p>
                      <table>
                        <tr>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Cadre</th>
                            <th>Service</th>
                            {/* <th>Action</th> */}
                        </tr>
                          {
                            filteredBookings.map((item, index)=>(
                              
                                
                                <tr>
                                    {/* <td><Avatar sx={{ bgcolor: "green" }}>{(item.username)}</Avatar></td> */}
                                    <td><img src="https://www.uniquemedical.com.au/wp-content/uploads/2024/03/Default_pfp.svg.png" alt="" /></td>
                                    <td>{item.username}</td>
                                    <td>{item.officerCadre}</td>
                                    <td>{item.serviceName}</td>
                                    {/* <td className=''>
                                  <div className="d-flex gap-3 flex-wrap h-100">
                                  <i class="bi bi-pencil-fill fs-4 text-success" onClick={() => handleUpdateBooking(item)}></i>
                                    <i class="bi bi-eye-fill fs-4 text-secondary"  onClick={() => handleViewDetails(item)}></i>
                                    <i class="bi bi-trash fs-4 text-danger" onClick={()=>deleteHandler(item.applicationNo)}></i>
                                  </div>
                                    </td> */}
                                </tr>
                            ))
                        }
                      </table>
                    </div>
                </div>
                <div className="col-md-6 mt-4">
                    <div className="all-bookings p-3 p-md-5">
                        <h1 className="fs-5">Pending Bookings</h1>
                        <h1 className="fs-6">   {bookings.filter((item)=>item.paymentStatus=="Pending").length} pending Bookings</h1>
                        <p className="fs-6 text-secondary">Here you can find all user with bookings</p>
                      <table>
                        <tr>
                            <th>Profile</th>
                            <th>Name</th>
                            {/* <th>Cadre</th> */}
                            <th>Service</th>
                            {/* <th>Action</th> */}
                        </tr>
                          {
                            bookings.map((item, index)=>(
                                item.paymentStatus == "Pending"?(
                                    <tr>
                                    {/* <td><Avatar sx={{ bgcolor: "green" }}>{(item.username)}</Avatar></td> */}
                                    <td><img src="https://www.uniquemedical.com.au/wp-content/uploads/2024/03/Default_pfp.svg.png" alt="" /></td>
                                    <td>{item.username}</td>
                                    {/* <td>{item.officerCadre}</td> */}
                                    <td>{item.serviceName}</td>
                                    {/* <td className=''>
                                   <div className="d-flex gap-2">
                                   <button className="btn btn-success btn-sm"  onClick={() => handleConfirmBooking(item.applicationNo)}><i class="bi bi-check-lg"></i></button>
                                   <button className="btn btn-danger btn-sm"  onClick={() => handleDeleteBooking(item.applicationNo)}><i class="bi bi-x-lg"></i></button>
                                   </div>
                                    </td> */}
                                </tr>
                                ):(null)
                            ))
                        }
                      </table>
                    </div>
                </div>
                <div className="col-md-6 mt-4">
                    <div className="all-bookings p-3 p-md-5">
                        <h1 className="fs-5">Confirmed Bookings</h1>
                        <h1 className="fs-6">   {bookings.filter((item)=>item.status=="confirmed").length} confirmed Bookings</h1>
                        <p className="fs-6 text-secondary">Here you can find all user with bookings</p>
                        <hr />
                     {
                        bookings.filter((item)=>item.status == "confirmed").length !=0?(
                            <table>
                            <tr>
                                <th>Profile</th>
                                <th>Name</th>
                                {/* <th>Cadre</th> */}
                                <th>Service</th>
                                {/* <th>Action</th> */}
                            </tr>
                              {
                                bookings.map((item, index)=>(
                                    item.status == "confirmed"?(
                                        <tr>
                                        {/* <td><Avatar sx={{ bgcolor: "green" }}>{(item.username)}</Avatar></td> */}
                                        <td><img src="https://www.uniquemedical.com.au/wp-content/uploads/2024/03/Default_pfp.svg.png" alt="" /></td>
                                        <td>{item.username}</td>
                                        {/* <td>{item.officerCadre}</td> */}
                                        <td>{item.serviceName}</td>
                                        {/* <td className=''>
                                        <div className="d-flex gap-2 flex-wrap h-100">
                                            <button className="btn btn-dark btn-sm"><i class="bi bi-send"></i>send SMS</button>
                                  </div>
                                        </td> */}
                                    </tr>
                                    ):(null)
                                ))
                            }
                          </table>
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
                        <h1 className="fs-6">   {bookings.filter((item)=>item.status=="rejected").length} Rejected Bookings</h1>
                        <p className="fs-6 text-secondary">Here you can find all user with bookings</p>
                        <hr />
                     {
                        bookings.filter((item)=>item.status == "rejected").length !=0?(
                            <table>
                            <tr>
                                <th>Profile</th>
                                <th>Name</th>
                                {/* <th>Cadre</th> */}
                                <th>Service</th>
                                {/* <th>Action</th> */}
                            </tr>
                              {
                                filteredBookings.map((item, index)=>(
                                    item.status == "rejected"?(
                                        <tr>
                                        {/* <td><Avatar sx={{ bgcolor: "green" }}>{(item.username)}</Avatar></td> */}
                                        <td><img src="https://www.uniquemedical.com.au/wp-content/uploads/2024/03/Default_pfp.svg.png" alt="" /></td>
                                        <td>{item.username}</td>
                                        {/* <td>{item.officerCadre}</td> */}
                                        <td>{item.serviceName}</td>
                                        {/* <td className=''>
                                       <div className="d-flex gap-2">
                                     
                                      
                                       <TooltipTo title="delete rejected booking"> <button className="btn btn-danger btn-sm" onClick={()=>deleteHandler(item.applicationNo)}><i class="bi bi-trash"></i></button></TooltipTo>
                                      <TooltipTo title="send reject sms"> <button className="btn btn-dark btn-sm"><i class="bi bi-send"></i></button></TooltipTo>
                                       </div>
                                        </td> */}
                                    </tr>
                                    ):(null)
                                ))
                            }
                          </table>
                        )
                        :(
                            <img src="https://img.freepik.com/premium-vector/access-documents-that-are-cloud-storage-is-closed-data-protection-flat-vector-illustration_124715-1657.jpg?w=740" className='w-100' alt="" />
                        )
                     }
                    </div>
                </div>
            </div>
          

            {/* {filteredBookings.map((booking, index) => (
                <Card className="mb-4" key={index}>
                    <Card.Body>
                        <Card.Title>{booking.serviceType}</Card.Title>
                        <Card.Text>{booking.serviceName}</Card.Text>
                        <Card.Text>Date: {new Date(booking.eventdate).toLocaleDateString()}</Card.Text>
                        <Card.Text>Total Cost: {booking.totalCost}</Card.Text>
                        <Button variant="success" onClick={() => handleConfirmBooking(booking._id)}>Confirm</Button>
                        <Button variant="danger" onClick={() => handleShowModal(booking)}>Reject</Button>
                        <Button variant="info" onClick={() => handleViewDetails(booking)}>View
                        </Button>
                        <Button variant="warning" onClick={() => handleUpdateBooking(booking)}>
                             Update
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteBooking(booking.applicationNo)}>
                             Delete
                        </Button>69*.
                    </Card.Body>
                </Card>
            ))} */}

         

            <Modal show={editModal} onHide={() => setEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <Form>
                            <Form.Group>
                                <Form.Label>Service Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedBooking.serviceType}
                                    onChange={(e) => setSelectedBooking({ ...selectedBooking, serviceType: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Service Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedBooking.serviceName}
                                    onChange={(e) => setSelectedBooking({ ...selectedBooking, serviceName: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={new Date(selectedBooking.eventdate).toISOString().substring(0, 10)}
                                    onChange={(e) => setSelectedBooking({ ...selectedBooking, eventdate: new Date(e.target.value) })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Total Cost</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedBooking.totalCost}
                                    onChange={(e) => setSelectedBooking({ ...selectedBooking, totalCost: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleEditSubmit}>Save changes</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={serviceBook} onHide={closeServiceModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <MainFunctionHallBooking/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleEditSubmit}>Save changes</Button>
                </Modal.Footer>
            </Modal>


            <Row className='mt-5'>
                <Col md={4} className='mb-4'>
                  <div className="card p-3 border-0 h-100">
                  <h3>Monthly Users</h3>
                    {renderTable(monthlyUsers)}
                    {/* <Bar data={generateChartData(monthlyUsers, 'Monthly Users', colors)} /> */}
                  </div>
                </Col>
                <Col md={4} className='mb-4'>
                 <div className="card border-0 p-3 h-100">
                 <h3>Service Types</h3>
                    {renderTable(serviceTypes)}
                    {/* <Pie data={generateChartData(serviceTypes, 'Service Types', colors)} /> */}
                 </div>
                </Col>
                <Col md={4} className='mb-4'>
                  <div className="card p-3 border-0 h-100">
                  <h3>Service Names</h3>
                    {renderTable(serviceNames)}
                    {/* <Pie data={generateChartData(serviceNames, 'Service Names', colors)} /> */}
                  </div>
                </Col>
                <Col md={4} className='mb-4'>
                  <div className="card p-3 border-0 h-100">
                  <h3>Sporti</h3>
                    {renderTable(sporti)}
                    {/* <Pie data={generateChartData(sporti, 'Sporti', colors)} /> */}
                  </div>
                </Col>
                <Col md={4} className='mb-4'>
                    <div className="card p-3 h-100">
                    <h3>Monthly Revenue</h3>
                    {renderTable(monthlyRevenue)}
                    {/* <Bar data={generateChartData(monthlyRevenue, 'Monthly Revenue', colors)} /> */}
                    </div>
                </Col>
            </Row>
        </Container>
      </div>
    );
};

export default ConferenceHall;
