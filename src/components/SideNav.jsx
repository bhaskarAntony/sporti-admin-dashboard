import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';

function SideNav() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid d-flex justif-content-between">
    <a class="navbar-brand" href="#">Admin Dashboard</a>
    <div className="d-flex gap-2">
    <Button variant="primary" onClick={handleShow} className="d-block d-md-none">
    <i class="bi bi-list text-white fs-3"></i>
      </Button>
     
    </div>
  </div>
</nav>

      <Offcanvas show={show} onHide={handleClose} className="app-left">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='text-white'>Admin Dashboard</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="sidenav">
            <li className="sidenav-item">
            <a href="/"><i class="bi bi-house-fill mx-2"></i>Home</a>
            </li>            
            <li className="sidenav-item">
            <a href="/bookings"><i class="bi bi-bar-chart-steps mx-2"></i>Room Bookings</a>
            </li>
            
            
            {/* <li className="sidenav-item">
            <a href="/feedback"><i class="bi bi-stars mx-2"></i>Feedback</a>
            </li> */}
            {/* <li className="sidenav-item">
            <a href="/testimonials"><i class="bi bi-quote mx-2"></i>Testimanials</a>
            </li>
            <li className="sidenav-item">
            <a href="/"><i class="bi bi-calendar2-range mx-2"></i>Webinars</a>
            </li>
            <li className="sidenav-item">
            <a href="/events"><i class="bi bi-boxes mx-2"></i>Events</a>
            </li>
            <li className="sidenav-item">
            <a href="/youtube-videos"><i class="bi bi-youtube mx-2"></i>Youtube Videos</a>
            </li>
            <li className="sidenav-item">
            <a href="/blogs"><i class="bi bi-postcard-heart-fill mx-2"></i> Blogs</a>
            </li>
            <li className="sidenav-item">
            <a href="/job"><i class="bi bi-postcard-heart-fill mx-2"></i>New Job</a>
            </li> */}
          </ul>

        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideNav;