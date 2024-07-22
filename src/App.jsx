import './App.css';
import SideNav from './components/SideNav';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Food from './pages/food/Food';
import Members from './components/Members/Members';
import ViewMember from './components/Members/ViewMember';
import Feedback from './pages/feedback/Feedback';
import ConferenceHall from './pages/Conferencehall/ConferenceHall';
import Dashboard from './components/dashboards/Dashboard';
import Login from './components/login/Login';
import PrivateRoute from './components/privateRoutes/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



function App() {
  return (
    <div className='container-fluid app'>
    <BrowserRouter>
    <ToastContainer/>
    
   <div className='row'>
    <div className='d-none d-md-block col-md-3 col-lg-2 app-left p-0'>
    <div className='nav p-3'>
      <div className="nav-top py-1 mb-3">
        <span className="fs-3 text-white">Admin Pannel</span>
      </div>
      <ul className="sidenav">
        <li className='sidenav-item'><Link to='/'><i class="bi bi-house-fill mx-2"></i> Dashboard</Link></li>
        {/* <li className="sidenav-item">
            <a href="/course"><i class="bi bi-mortarboard-fill mx-2"></i>Food Orders</a>
            </li> */}
        <li className='sidenav-item'><Link to='/bookings'><i class="bi bi-back mx-2"></i> Bookings</Link></li>
        {/* <li className='sidenav-item'><Link to='/advantages'><i class="bi bi-bar-chart-steps mx-2"></i>Adwantages</Link></li> */}
        {/* <li className='sidenav-item'><Link to='/companies'><i class="bi bi-building mx-2"></i>Conference hall</Link></li>
        <li className='sidenav-item'><Link to='/'><i class="bi bi-stars mx-2"></i>Main Event Hall </Link></li>
        <li className='sidenav-item'><Link to='/members'><i class="bi bi-quote mx-2"></i>Members</Link></li>
        <li className='sidenav-item'><Link to='/feedback'><i class="bi bi-quote mx-2"></i>feedback list</Link></li>
        <li className='sidenav-item'><Link to='/conferencehall'><i class="bi bi-quote mx-2"></i>Conference Hall</Link></li> */}
        {/* <li className='sidenav-item'><Link to='/courses'><i class="bi bi-calendar2-range mx-2"></i>Webinar</Link></li>
        <li className='sidenav-item'><Link to='/events'><i class="bi bi-boxes mx-2"></i>Events</Link></li>
        <li className='sidenav-item'><Link to='/youtube-videos'><i class="bi bi-youtube mx-2"></i>Youtube Videos</Link></li>
        <li className='sidenav-item'><Link to='/blogs'><i class="bi bi-postcard-heart-fill mx-2"></i>Blogs</Link></li>
        <li className='sidenav-item'><Link to='/job'><i class="bi bi-postcard-heart-fill mx-2"></i>New Job</Link></li> */}
         {/* <li className='sidenav-item'><Link to='/feedback'><i class="bi bi-quote mx-2"></i>feedback list</Link></li> */}
      </ul>
    </div>
    </div>
    <div className='col-sm-12 col-md-9 col-lg-10 app-right p-0'>
    <SideNav/>
   <div className="p-3">
   <Routes>
     <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
     <Route path='/members' element={<Members/>}/>
     <Route path='/members/view/:id' element={<ViewMember/>}/>
     <Route path='/feedback' element={<Feedback/>}/>
     <Route path='/bookings' element={<ConferenceHall/>}/>
    </Routes>
   </div>
    </div>
   </div>
    </BrowserRouter>
    </div>
  
  );
}

export default App;