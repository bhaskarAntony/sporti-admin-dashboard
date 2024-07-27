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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);
function sanitizeInput(input) {
    return DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });
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
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('https://sporti-services-backend.onrender.com/api/admin', {
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
            await axios.patch(`https://sporti-services-backend.onrender.com/api/sporti/service/${selectedBooking._id}/reject`, { rejectionReason });
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
            await axios.patch(`https://sporti-services-backend.onrender.com/api/sporti/service/${bookingId}/confirm`);
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

    const handleDeleteBooking = async (bookingId) => {
        setLoading(true);
        try {
            await axios.delete(`https://sporti-services-backend.onrender.com/api/sporti/service/${bookingId}`);
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
            await axios.patch(`https://sporti-services-backend.onrender.com/api/sporti/service/${selectedBooking._id}`, selectedBooking);
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
                        <Form.Label>Check In</Form.Label>
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
                        <Form.Label>Check Out</Form.Label>
                        <Select
                            value={filters.checkOut}
                            onChange={option => setFilters({ ...filters, checkOut: option })}
                            options={dateOptions}
                            placeholder="Select Check Out Date"
                        />
                    </Form.Group>
                </Col>
                <Col className="d-flex align-items-end">
                    <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
                </Col>
            </Row>

            {filteredBookings.map((booking, index) => (
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
                        <Button variant="danger" onClick={() => handleDeleteBooking(booking._id)}>
                             Delete
                        </Button>
                    </Card.Body>
                </Card>
            ))}

            <Modal show={showModal} onHide={handleCloseModal}>
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
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    {!viewDetails && <Button variant="primary" onClick={handleRejectBooking}>Reject</Button>}
                </Modal.Footer>
            </Modal>

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

            <Row>
                <Col>
                    <h3>Monthly Users</h3>
                    {renderTable(monthlyUsers)}
                    <Bar data={generateChartData(monthlyUsers, 'Monthly Users', colors)} />
                </Col>
                <Col>
                    <h3>Service Types</h3>
                    {renderTable(serviceTypes)}
                    <Pie data={generateChartData(serviceTypes, 'Service Types', colors)} />
                </Col>
                <Col>
                    <h3>Service Names</h3>
                    {renderTable(serviceNames)}
                    <Pie data={generateChartData(serviceNames, 'Service Names', colors)} />
                </Col>
                <Col>
                    <h3>Sporti</h3>
                    {renderTable(sporti)}
                    <Pie data={generateChartData(sporti, 'Sporti', colors)} />
                </Col>
                <Col>
                    <h3>Monthly Revenue</h3>
                    {renderTable(monthlyRevenue)}
                    <Bar data={generateChartData(monthlyRevenue, 'Monthly Revenue', colors)} />
                </Col>
            </Row>
        </Container>
    );
};

export default ConferenceHall;
