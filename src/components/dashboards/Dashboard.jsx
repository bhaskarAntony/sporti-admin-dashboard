import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Container, Row, Col, Card, Table, Button, ProgressBar } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import Select from 'react-select';
import { CSVLink } from 'react-csv';
import cookies from 'js-cookie'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
];

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [monthlyUsers, setMonthlyUsers] = useState({});
    const [pendingUsers, setPendingUsers] = useState({});
    const [rejectedUsers, setRejectedUsers] = useState({});
    const [successfulUsers, setSuccessfulUsers] = useState({});
    const [successfulPayments, setSuccessfulPayments] = useState({});
    const [serviceTypes, setServiceTypes] = useState({});
    const [serviceNames, setServiceNames] = useState({});
    const [sporti, setSporti] = useState({});
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState({});
    const [bookings, setBookings] = useState([]);
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = cookies.get('token');
        axios.get('https://sporti-services-backend.onrender.com/api/admin', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setData(response.data);
                processChartData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    const processChartData = (data) => {
        const monthlyUsersData = {};
        const pendingUsersData = {};
        const rejectedUsersData = {};
        const successfulUsersData = {};
        const successfulPaymentsData = {};
        const serviceTypesData = {};
        const serviceNamesData = {};
        const sportiData = {};
        const monthlyRevenueData = {};
        let totalRevenueData = 0;

        data.forEach(item => {
            const month = new Date(item.eventdate).getMonth() + 1;

            monthlyUsersData[month] = (monthlyUsersData[month] || 0) + 1;

            if (item.status === 'pending') {
                pendingUsersData[month] = (pendingUsersData[month] || 0) + 1;
            }

            if (item.status === 'rejected') {
                rejectedUsersData[month] = (rejectedUsersData[month] || 0) + 1;
            }

            if (item.status === 'approved') {
                successfulUsersData[month] = (successfulUsersData[month] || 0) + 1;
            }

            if (item.paymentStatus === 'Completed') {
                successfulPaymentsData[month] = (successfulPaymentsData[month] || 0) + 1;
                totalRevenueData += parseFloat(item.totalCost) || 0;
                monthlyRevenueData[month] = (monthlyRevenueData[month] || 0) + parseFloat(item.totalCost);
            }

            serviceTypesData[item.serviceType] = (serviceTypesData[item.serviceType] || 0) + 1;
            serviceNamesData[item.serviceName] = (serviceNamesData[item.serviceName] || 0) + 1;
            sportiData[item.sporti] = (sportiData[item.sporti] || 0) + 1;
        });

        setMonthlyUsers(monthlyUsersData);
        setPendingUsers(pendingUsersData);
        setRejectedUsers(rejectedUsersData);
        setSuccessfulUsers(successfulUsersData);
        setSuccessfulPayments(successfulPaymentsData);
        setServiceTypes(serviceTypesData);
        setServiceNames(serviceNamesData);
        setSporti(sportiData);
        setTotalRevenue(totalRevenueData);
        setMonthlyRevenue(monthlyRevenueData);
    };

    const handleMonthChange = (selectedOption) => {
        setSelectedMonth(selectedOption);
    };

    const filterDataByMonth = (data) => {
        if (!selectedMonth) return data;
        const month = selectedMonth.value;
        return data.filter(item => new Date(item.eventdate).getMonth() + 1 === month);
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

    const revenueChartData = {
        labels: Object.keys(monthlyRevenue),
        datasets: [
            {
                label: 'Monthly Revenue',
                data: Object.values(monthlyRevenue),
                fill: false,
                borderColor: '#4BC0C0',
                tension: 0.1,
            },
        ],
    };

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#36A2EB'];

    const filteredData = filterDataByMonth(data);
    const headers = [
        { label: "Username", key: "username" },
        { label: "Email", key: "email" },
        { label: "Officer Designation", key: "officerDesignation" },
        { label: "Officer Cadre", key: "officerCadre" },
        { label: "Phone Number", key: "phoneNumber" },
        { label: "Application No", key: "applicationNo" },
        { label: "Sport", key: "sporti" },
        { label: "Service Name", key: "serviceName" },
        { label: "Event Date", key: "eventdate" },
        { label: "Service Type", key: "serviceType" },
        { label: "No. of Guests", key: "noGuests" },
        { label: "Payment Status", key: "paymentStatus" },
        { label: "Total Cost", key: "totalCost" },
        { label: "Status", key: "status" },
        { label: "Rejection Reason", key: "rejectionReason" }
    ];

    const renderTable = (data) => (
        <Table striped bordered hover className='mt-3'>
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

    const renderProgress = (data, label) => (
        <Card.Text>
            <strong>{label}: </strong>
            <ProgressBar now={data} label={`${data}`} />
        </Card.Text>
    );

    return (
        <Container fluid>
            <Row className="my-4">
                <Col>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        options={months}
                        placeholder="Select Month"
                    />
                </Col>
                <Col className="text-end">
                    <CSVLink
                        data={filteredData}
                        headers={headers}
                        filename={`booking_data_${selectedMonth ? selectedMonth.label : 'all'}.csv`}
                        className="btn btn-primary"
                    >
                        Download Data
                    </CSVLink>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="shadow mb-4">
                        <Card.Body>
                            <Card.Title>Total Revenue: ₹{totalRevenue}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6} className="mb-3">
                    <Card className="h-100 shadow">
                        <Card.Body>
                            <Card.Title>Monthly Revenue</Card.Title>
                            <Line data={revenueChartData} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-3">
                    <Card className="h-100 shadow">
                        <Card.Body>
                            <Card.Title>Monthly Users</Card.Title>
                            {renderProgress(Object.keys(monthlyUsers).length, 'Users')}
                            <Bar data={generateChartData(monthlyUsers, 'Users', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                            {renderTable(monthlyUsers)}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="h-100 shadow">
                        <Card.Body>
                            <Card.Title>Pending Users</Card.Title>
                            {renderProgress(Object.keys(pendingUsers).length, 'Pending Users')}
                            <Bar data={generateChartData(pendingUsers, 'Pending Users', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                            {renderTable(successfulUsers)}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="h-100 shadow">
                        <Card.Body>
                            <Card.Title>Rejected Users</Card.Title>
                            {renderProgress(Object.keys(rejectedUsers).length, 'Rejected Users')}
                            <Bar data={generateChartData(rejectedUsers, 'Rejected Users', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                            {renderTable(successfulUsers)}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="h-100 shadow">
                        <Card.Body>
                            <Card.Title>Successful Users</Card.Title>
                            {renderProgress(Object.keys(successfulUsers).length, 'Successful Users')}
                            <Bar data={generateChartData(successfulUsers, 'Successful Users', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks:{ label: function (context) { return context.raw; } } } } }} />
                            {renderTable(successfulUsers)}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="h-100 shadow">
                        <Card.Body>
                            <Card.Title>Successful Payments</Card.Title>
                            {renderProgress(Object.keys(successfulPayments).length, 'Successful Payments')}
                            <Bar data={generateChartData(successfulPayments, 'Successful Payments', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                            {renderTable(successfulUsers)}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="h-100 shadow">
                        <Card.Body>
                            <Card.Title>Service Types</Card.Title>
                            <Pie data={generateChartData(serviceTypes, 'Service Types', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                            {renderTable(successfulUsers)}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="h-100 shadow">
                        <Card.Body>
                            <Card.Title>Service Names</Card.Title>
                            <Pie data={generateChartData(serviceNames, 'Service Names', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                            {renderTable(successfulUsers)}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="h-100 shadow">
                        <Card.Body>
                            <Card.Title>Sporti</Card.Title>
                            <Pie data={generateChartData(sporti, 'Sporti', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                            {renderTable(successfulUsers)}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
