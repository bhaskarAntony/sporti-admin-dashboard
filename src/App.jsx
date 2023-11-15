import './App.css';
import EventsUpload from './components/EventsUpload';
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import SideNav from './components/SideNav';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import TrainingMode from './components/TrainingMode';
import Companies from './components/Companies';
import YoutubeVideos from './components/YoutubeVideo';
import Advantages from './components/Advantages';
import Testimonials from './components/Testimonials';
import BlogPost from './components/BlogsPost';
import ImageStore from './components/ImageStore';
import Course from './components/courses/Course';


function App() {
  return (
    <div className='container-fluid app'>
    <BrowserRouter>
    
   <div className='row'>
    <div className='d-none d-md-block col-md-3 col-lg-2 app-left'>
    <div className='nav'>
      <div className="nav-top py-1 mb-3">
        <span className="fs-3 text-white">Admin Pannel</span>
      </div>
      <ul className="sidenav">
        <li className='sidenav-item'><Link to='/courses'><i class="bi bi-house-fill mx-2"></i> Home</Link></li>
        <li className="sidenav-item">
            <a href="/course"><i class="bi bi-mortarboard-fill mx-2"></i>Courses</a>
            </li>
        <li className='sidenav-item'><Link to='/courses'><i class="bi bi-back mx-2"></i>Traning Card</Link></li>
        <li className='sidenav-item'><Link to='/courses'><i class="bi bi-bar-chart-steps mx-2"></i>Adwantages</Link></li>
        <li className='sidenav-item'><Link to='/courses'><i class="bi bi-building mx-2"></i>Companies</Link></li>
        <li className='sidenav-item'><Link to='/courses'><i class="bi bi-stars mx-2"></i>Elite Program</Link></li>
        <li className='sidenav-item'><Link to='/courses'><i class="bi bi-quote mx-2"></i>Testimonials</Link></li>
        <li className='sidenav-item'><Link to='/courses'><i class="bi bi-calendar2-range mx-2"></i>Webinar</Link></li>
        <li className='sidenav-item'><Link to='/courses'><i class="bi bi-boxes mx-2"></i>Events</Link></li>
        <li className='sidenav-item'><Link to='/courses'><i class="bi bi-youtube mx-2"></i>Youtube Videos</Link></li>
        <li className='sidenav-item'><Link to='/courses'><i class="bi bi-postcard-heart-fill mx-2"></i>Blogs</Link></li>
      </ul>
    </div>
    </div>
    <div className='col-sm-12 col-md-9 col-lg-10 app-right'>
    <SideNav/>
    <Routes>
      <Route path='/hero' element={<EventsUpload/>}/>
      <Route path='/training-mode' element={<TrainingMode/>}/>
      <Route path='/companies' element={<Companies/>}/>
      <Route path='/youtube-videos' element={<YoutubeVideos/>}/>
      <Route path='/advantages' element={<Advantages/>}/>
      <Route path='/testimonials' element={<Testimonials/>}/>
      <Route path='/blogs' element={<BlogPost/>}/>
      <Route path='/imageStore' element={<ImageStore/>}/>
      <Route path='/course' element={<Course/>}/>
    </Routes>
    </div>
   </div>
    </BrowserRouter>
    </div>
  
  );
}

export default App;