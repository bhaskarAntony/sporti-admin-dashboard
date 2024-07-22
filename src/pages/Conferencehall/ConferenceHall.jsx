import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import Select from 'react-select';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import MainRoomBook from '../../components/Bookings/RoomBooking';
import MainFunctionHallBooking from '../../components/Bookings/ServiceBook';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ConferenceHall = () => {
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showManualBookingModal, setShowManualBookingModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedBookingId, setSelectedBookingId] = useState(null);
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

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, bookings]);

    const fetchBookings = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('https://sporti-services-backend.onrender.com/api/admin',{
            headers: { Authorization: `Bearer ${token}` }
        });
            setBookings(res.data);
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

    const handleShowModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setRejectionReason('');
        setSelectedBookingId(null);
    };

    const handleRejectBooking = async () => {
        try {
            await axios.patch(`https://sporti-services-backend.onrender.com/api/sporti/service/${selectedBookingId}/reject`, { rejectionReason });
            fetchBookings(); // Refresh bookings after rejection
            handleCloseModal();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleConfirmBooking = async (bookingId) => {
        try {
            await axios.patch(`https://sporti-services-backend.onrender.com/api/sporti/service/${bookingId}/confirm`);
            fetchBookings(); // Refresh bookings after confirmation
        } catch (error) {
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

    const openServiceModal = () => setServiceBook(true)
    const closeServiceModal = () => setServiceBook(false)

    return (
        <Container>
            <Row className="mb-4">
                <Col>
                    <Form.Group>
                        <Form.Label>Service Type</Form.Label>
                        <Select
                            value={filters.serviceType}
                            onChange={option => setFilters({ ...filters, serviceType: option })}
                            options={serviceTypeOptions}
                            placeholder="Select Service Type"
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Service Name</Form.Label>
                        <Select
                            value={filters.serviceName}
                            onChange={option => setFilters({ ...filters, serviceName: option })}
                            options={serviceNameOptions}
                            placeholder="Select Service Name"
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Check In Date</Form.Label>
                        <Select
                            value={filters.checkIn}
                            onChange={option => setFilters({ ...filters, checkIn: option })}
                            options={dateOptions}
                            placeholder="Select Check In Date"
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Check Out Date</Form.Label>
                        <Select
                            value={filters.checkOut}
                            onChange={option => setFilters({ ...filters, checkOut: option })}
                            options={dateOptions}
                            placeholder="Select Check Out Date"
                        />
                    </Form.Group>
                </Col>
            </Row>
         <div className="d-flex gap-3">
         <Button className="mb-4" onClick={() => setShowManualBookingModal(true)}>Add Manual Room Booking</Button>
         <Button className="mb-4" onClick={openServiceModal}>Add Manual Service Booking</Button>
         </div>
            {filteredBookings.length === 0 && (
                <p>No bookings available for the selected filters.</p>
            )}
            {filteredBookings.length > 0 && (
                <>
                    <Table striped bordered hover className="mb-4">
                        <thead>
                            <tr className='table-primary'>
                                <th>User</th>
                                <th>Service Name</th>
                                <th>Event Date</th>
                                <th>Status</th>
                                <th>Total Cost</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.username}</td>
                                    <td>{booking.serviceName}</td>
                                    <td>{new Date(booking.eventdate).toLocaleDateString()}</td>
                                    <td className={booking.status === 'confirmed' ? 'text-success' : 'text-danger'}>{booking.status}</td>
                                    <td>{booking.totalCost}</td>
                                    <td>
                                        {booking.status === 'pending' && (
                                            <div className='d-flex gap-2'>
                                                <Button className='btn btn-primary' onClick={() => handleConfirmBooking(booking._id)}>Confirm</Button>
                                                <Button className='btn btn-danger' onClick={() => handleShowModal(booking._id)}>Reject</Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Monthly Users</Card.Title>
                                    <Bar data={generateChartData(monthlyUsers, 'Monthly Users', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                                    {renderTable(monthlyUsers)}
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-4 mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Service Types</Card.Title>
                                    <Pie data={generateChartData(serviceTypes, 'Service Types', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                                    {renderTable(serviceTypes)}
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-4 mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Service Names</Card.Title>
                                    <Pie data={generateChartData(serviceNames, 'Service Names', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                                    {renderTable(serviceNames)}
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-4 mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Sporti</Card.Title>
                                    <Pie data={generateChartData(sporti, 'Sporti', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                                    {renderTable(sporti)}
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-4 mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Monthly Revenue</Card.Title>
                                    <Bar data={generateChartData(monthlyRevenue, 'Monthly Revenue', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                                    {renderTable(monthlyRevenue)}
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-4 mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Total Cost</Card.Title>
                                    <p>Total Cost: {totalCost}</p>
                                    <Pie data={generateChartData({ totalCost }, 'Total Cost', ['#FF6384'])} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </>
            )}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Provide Rejection Reason</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="rejectionReason">
                        <Form.Label>Reason</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter reason for rejection"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleRejectBooking}>
                        Reject
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showManualBookingModal} onHide={() => setShowManualBookingModal(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Manual  Room Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <MainRoomBook/>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowManualBookingModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddManualBooking}>
                        Add Booking
                    </Button>
                </Modal.Footer> */}
            </Modal>

              <Modal show={serviceBook} onHide={closeServiceModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Manual Service Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <MainFunctionHallBooking/>
                </Modal.Body>
               
            </Modal>
        </Container>
    );
};

export default ConferenceHall;
