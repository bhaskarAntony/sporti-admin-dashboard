import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Container, Row, Col, Card, Table, Button, ProgressBar, Modal, Form, Accordion } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import Select from 'react-select';
import { CSVLink } from 'react-csv';
import cookies from 'js-cookie'
import './style.css'
import { Avatar } from '@mui/material';
import { toast } from 'react-toastify';
import Loading from '../popup/Loading';
import TooltipTo from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../hooks/BookingContext';
import AllRooms from './AllRooms';

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
    const { Contextbookings, isloading, error, fetchBookings } = useContext(BookingContext);
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
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [viewDetails, setViewDetails] = useState(null)
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const navigate = useNavigate();

    
    useEffect(()=>{
        setData(Contextbookings);
        processChartData(Contextbookings);
    }, [Contextbookings])

   

//    const fetchBookings = () =>{
//     axios.get('https://sporti-backend-live-2.onrender.com/api/sporti/service/bookings')
//     .then(response => {
//         setLoading(false);
//         setData(response.data);
//         console.log(response.data.reverse());
        
//         processChartData(response.data);
//     })
//     .catch(error => {
//         setLoading(false)
//         console.error('There was an error fetching the data!', error);
//     });
//    }
//    fetchBookings()

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

            if (item.status === 'confirmed') {
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
    const xAxisLabel = 'Months';
const yAxisLabel = 'Sales in Units';

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

    const generateChartOptions = (xAxisLabel, yAxisLabel) => ({
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: xAxisLabel,
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: yAxisLabel,
                },
            },
        },
    });

    const chartOptions = generateChartOptions(xAxisLabel, yAxisLabel);
    const revenueChartData = {
        labels: Object.keys(monthlyRevenue),
        datasets: [
            {
                label: 'Monthly Revenue',
                data: Object.values(monthlyRevenue),
                fill: false,
                borderColor: 'transparent',
                tension: 0.1,
            },
        ],
    };

    const colors = ['#36BA98', '#F19ED2', '#3AA6B9', '#F2C18D', '#9966FF', '#FF9F40', '#E7E9ED', '#36A2EB'];

   

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
        { label: "Event Date", key: "checkIn" },
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
    if(loading || isloading){
        return <Loading/>
    }
    const showDetails = (data) =>{
        setViewDetails(data);
        setShowModal(true)
    }

    const handleConfirmBooking = async (formData) => {
       if(formData.serviceName == "Room Booking"){
            navigate(`/select/room`, { state: {data:formData } })
       }else{
        setLoading(true);
        try {
            await axios.patch(`https://sporti-backend-live-p00l.onrender.com/api/sporti/service/${formData._id}/confirm`);
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

   const resendSMS = async(id)=>{
   await axios.get(`https://sporti-backend-live-p00l.onrender.com/api/sporti/service/send/room/sms/${id}`)
   .then((res)=>{
    console.log(res);
    toast.success('Done')
    
   })
   .catch((err)=>{
    console.log(err);
    toast.error('error please try again later..')
   })
   }
   


    const gotoViewDetails = (formData) => {
       if(formData.serviceName == "Room Booking"){
         navigate('/view/room/details', { state: {data:formData } });
       }
       else{
        navigate('/view/service/details', { state: {data:formData } });
       }
  }
    return (
        <Container fluid className='dashboard p-3 p-md-5'>
              <div className="row">
                <div className="col-md-3">
                    <div className="card p-2 border-0 d-flex gap-2 flex-row align-items-center mb-4">
                        <div className="icon">
                        <i>&#8377;</i>
                        </div>
                       <div>
                       <h4 className="fs-5">Monthly Revenue</h4>
                        <h3 className="fs-4">&#8377; {totalRevenue}/-</h3>
                        <p className="fs-6 text-secondary">August 07 2024</p>
                       </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-2 border-0 d-flex gap-2 flex-row align-items-center mb-4">
                        <div className="icon">
                        <i class="bi bi-people"></i>
                        </div>
                       <div>
                       <h4 className="fs-5">Total unique users</h4>
                        <h3 className="fs-4">{data.length}</h3>
                        <p className="fs-6 text-secondary">August 07 2024</p>
                       </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-2 border-0 d-flex gap-2 flex-row align-items-center mb-4">
                        <div className="icon">
                        <i class="bi bi-ui-checks-grid"></i>
                        </div>
                       <div>
                       <h4 className="fs-5">Confirmed Bookings</h4>
                        <h3 className="fs-4">{data.filter((item)=>item.status =="confirmed").length}</h3>
                        <p className="fs-6 text-secondary">August 07 2024</p>
                       </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-2 border-0 d-flex gap-2 flex-row align-items-center mb-4">
                        <div className="icon">
                        <i class="bi bi-people"></i>
                        </div>
                       <div>
                       <h4 className="fs-5">Pending Users</h4>
                        <h3 className="fs-4">{data.filter((item)=>item.status=='pending').length}</h3>
                        <p className="fs-6 text-secondary">August 07 2024</p>
                       </div>
                    </div>
                </div>
            </div>
            <div className="p-2 py-4">
           <h1 className="fs-2">Visual Charts</h1>
           </div>
           <hr />
            <Row className='mt-4'>
                {/* <Col md={4} className="mb-3">
                    <Card className="h-100  border-0">
                        <Card.Body>
                            <Card.Title>Monthly Revenue</Card.Title>
                            <hr />
                            <br />
                            <Line data={revenueChartData} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                        </Card.Body>
                    </Card>
                </Col> */}
                <Col md={4} className="mb-3">
                    <Card className="h-100  border-0">
                        <Card.Body>
                            <Card.Title>Monthly Bookings</Card.Title>
                            <hr />
                            <br />
                            {/* {renderProgress(Object.keys(monthlyUsers).length, 'Users')} */}
                           <Bar 
                    data={generateChartData(monthlyUsers, 'Users', colors)} 
                    options={{
                        scales: {
                            x: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Months', // X-axis label
                                },
                            },
                            y: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Number of Users', // Y-axis label
                                },
                            },
                        },
                        plugins: {
                            legend: {
                                display: true,
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return context.raw;
                                    },
                                },
                            },
                        },
                    }} 
                />

                            {/* {renderTable(monthlyUsers)} */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="h-100 ">
                        <Card.Body>
                            <Card.Title>Pending Bookings</Card.Title>
                            <hr />
                            <br />
                            {/* {renderProgress(Object.keys(pendingUsers).length, 'Pending Users')} */}
                            <Bar 
    data={generateChartData(pendingUsers, 'Pending Users', colors)} 
    options={{
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Months', // X-axis label
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Number of Pending Users', // Y-axis label
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.raw;
                    },
                },
            },
        },
    }} 
/>

                            {/* {renderTable(successfulUsers)} */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="h-100  border-0">
                        <Card.Body>
                            <Card.Title>Rejected Bookings</Card.Title>
                            <hr />
                            <br />
                            {/* {renderProgress(Object.keys(rejectedUsers).length, 'Rejected Users')} */}
                            <Bar 
    data={generateChartData(rejectedUsers, 'Rejected Users', colors)} 
    options={{
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Months', // X-axis label
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Number of Rejected Users', // Y-axis label
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.raw;
                    },
                },
            },
        },
    }} 
/>

                            {/* {renderTable(successfulUsers)} */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="h-100  border-0">
                        <Card.Body>
                            <Card.Title>Successful Payments</Card.Title>
                            <hr />
                            <br />
                            {/* {renderProgress(Object.keys(successfulUsers).length, 'Successful Users')} */}
                            <Bar data={generateChartData(successfulUsers, 'Successful Users', colors)} options={{ 
                                scales: {
                                    x: {
                                        display: true,
                                        title: {
                                            display: true,
                                            text: 'Months', // X-axis label
                                        },
                                    },
                                    y: {
                                        display: true,
                                        title: {
                                            display: true,
                                            text: 'Number of Successful Users', // Y-axis label
                                        },
                                    },
                                },
                                plugins: { legend: { display: true }, tooltip: { callbacks:{ label: function (context) { return context.raw; } } } } }} />
                            {/* {renderTable(successfulUsers)} */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="h-100  border-0">
                        <Card.Body>
                            <Card.Title>Confirmed Bookings</Card.Title>
                            <hr />
                            <br />
                            {/* {renderProgress(Object.keys(successfulPayments).length, 'Successful Payments')} */}
                            <Bar data={generateChartData(successfulPayments, 'Successful Payments', colors)} options={{
                                 scales: {
                                    x: {
                                        display: true,
                                        title: {
                                            display: true,
                                            text: 'Months', // X-axis label
                                        },
                                    },
                                    y: {
                                        display: true,
                                        title: {
                                            display: true,
                                            text: 'Number of Successful Payments', // Y-axis label
                                        },
                                    },
                                }, plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                            {/* {renderTable(successfulUsers)} */}
                        </Card.Body>
                    </Card>
                </Col>
                {/* <Col md={4} className="mb-3">
                    <Card className="h-100  border-0">
                        <Card.Body>
                            <Card.Title>Service Types</Card.Title>
                            <hr />
                            <br />
                            <Pie data={generateChartData(serviceTypes, 'Service Types', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                            {renderTable(successfulUsers)}
                        </Card.Body>
                    </Card>
                </Col> */}
                <Col md={4} className="mb-3">
                    <Card className="h-100  border-0">
                        <Card.Body>
                            <Card.Title>Service Names</Card.Title>
                            <hr />
                            <br />
                            <Pie data={generateChartData(serviceNames, 'Service Names', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                            {/* {renderTable(successfulUsers)} */}
                        </Card.Body>
                    </Card>
                </Col>
                {/* <Col md={4} className="mb-3">
                    <Card className="h-100  border-0">
                        <Card.Body>
                            <Card.Title>Sporti</Card.Title>
                            <hr />
                            <br />
                            <Pie data={generateChartData(sporti, 'Sporti', colors)} options={{ plugins: { legend: { display: true }, tooltip: { callbacks: { label: function (context) { return context.raw; } } } } }} />
                            {renderTable(successfulUsers)}
                        </Card.Body>
                    </Card>
                </Col> */}
            </Row>
            <hr />
           <Accordion>
            <Accordion.Item eventKey='1'>
                <Accordion.Header>
                   View SPORTI-1 Rooms Details
                </Accordion.Header>
                <Accordion.Body>
                <AllRooms roomType="VIP" sporti='SPORTI-1'/>
            <AllRooms roomType="Standard" sporti='SPORTI-1'/>
            <AllRooms roomType="Family" sporti='SPORTI-1'/>
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey='2'>
                <Accordion.Header>
                   View SPORTI-2 Rooms Details
                </Accordion.Header>
                <Accordion.Body>
            <AllRooms roomType="Standard" sporti='SPORTI-1'/>
            <AllRooms roomType="Family" sporti='SPORTI-1'/>
                </Accordion.Body>
            </Accordion.Item>
           </Accordion>
            <Row className="my-4">
                {/* <Col>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        options={months}
                        placeholder="Select Month"
                        className='border-1'
                    />
                </Col> */}
                <Col className="text-end">
                    <CSVLink
                        data={filteredData}
                        headers={headers}
                        filename={`booking_data_${selectedMonth ? selectedMonth.label : 'all'}.csv`}
                        className="main-btn"
                    >
                        <i class="bi bi-download"></i> Download Data
                    </CSVLink>
                </Col>
            </Row>
          
            <div className="row">
                <div className="col-md-12">
                    <div className="all-bookings p-3 p-md-5">
                        <h1 className="fs-5">Recent Bookings</h1>
                        <p className="fs-6 text-secondary">Here you can find all user with bookings</p>
                        {
                            data.length!=0?(
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
                            ):(
                                <div className="col-md-3 m-auto">
                                <img src="https://img.freepik.com/premium-vector/access-documents-that-are-cloud-storage-is-closed-data-protection-flat-vector-illustration_124715-1657.jpg?w=740" className='w-100' alt="" />
                              </div>
                            )
                        }
                    </div>
                </div>
                <div className="col-md-12 mt-4">
                    <div className="all-bookings p-3 p-md-5">
                        <h1 className="fs-5">Pending Bookings</h1>
                        <h1 className="fs-6">   {data.filter((item)=>item.status=="pending").length} pending Bookings</h1>
                        <p className="fs-6 text-secondary">Here you can find all Pending bookings</p>
                     
                 {
                    data.filter((item) => item.status == "pending").length !=0?(
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
                                       <button className="btn btn-success btn-sm" onClick={()=>handleConfirmBooking(item)}><i class="bi bi-check-lg"></i>Confirm</button>
                                       </TooltipTo>
                                        <TooltipTo title="reject booking">
                                        <button className="btn btn-danger btn-sm"  onClick={() => handleShowModal(item)}><i class="bi bi-x-lg"></i>Reject</button>
                                        </TooltipTo>
                                        {/* <TooltipTo title="Send SMS">
                                        <button className="btn btn-dark btn-sm"  onClick={() => handleShowModal(item)}><i class="bi bi-send"></i></button>
                                        </TooltipTo> */}
                                        </div>
                                         </td>
                                     </tr>
                                     ):(null)
                                 ))
                             }
                           </table>
                        </div>

                    ):(
                            <div className="col-md-3 m-auto">
                             <img src="https://img.freepik.com/premium-vector/access-documents-that-are-cloud-storage-is-closed-data-protection-flat-vector-illustration_124715-1657.jpg?w=740" className='w-100' alt="" />
                           </div>
                    )
                 }
                    </div>
                </div>
                <div className="col-md-12 mt-4">
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
                                        <TooltipTo title="reject booking">
                                   <button className="btn btn-danger btn-sm"  onClick={() => handleShowModal(item)}><i class="bi bi-x-lg"></i></button>
                                   </TooltipTo>
                                        {/* <TooltipTo title="send reject booking">    <button className="btn btn-success btn-sm"  onClick={() => handleShowModal(item)}>&#8377;<i class="bi bi-check"></i></button></TooltipTo> */}
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
                           <div className="col-md-3 m-auto">
                             <img src="https://img.freepik.com/premium-vector/access-documents-that-are-cloud-storage-is-closed-data-protection-flat-vector-illustration_124715-1657.jpg?w=740" className='w-100' alt="" />
                           </div>
                        )
                     }
                    </div>
                </div>
                <div className="col-md-12 mt-4">
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
                                     
                                      
                                     
                                      <TooltipTo title="Confirm">   <button className="btn btn-success btn-sm" onClick={()=>handleConfirmBooking(item)}><i class="bi bi-check-lg"></i>Confirm</button></TooltipTo>
                                      <TooltipTo title="delete rejected booking"> <button className="btn btn-danger btn-sm" onClick={()=>deleteHandler(item.applicationNo)}><i class="bi bi-trash"></i>Delete</button></TooltipTo>
                                      {/* <TooltipTo title="Send SMS">
                                   <button className="btn btn-dark btn-sm"  onClick={() => handleShowModal(item)}><i class="bi bi-send"></i></button>
                                   </TooltipTo> */}
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
                           <div className="col-md-3 m-auto">
                             <img src="https://img.freepik.com/premium-vector/access-documents-that-are-cloud-storage-is-closed-data-protection-flat-vector-illustration_124715-1657.jpg?w=740" className='w-100' alt="" />
                           </div>
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
        </Container>
    );
};

export default Dashboard;
