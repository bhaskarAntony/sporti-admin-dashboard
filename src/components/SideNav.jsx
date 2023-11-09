import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

function SideNav() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid d-flex justif-content-between">
    <a class="navbar-brand" href="#">Admin Dashboard</a>
    <Button variant="primary" onClick={handleShow}>
    <i class="bi bi-list text-white fs-3"></i>
      </Button>
  </div>
</nav>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Dashboard</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <a href="/" className='nav-link'>Home</a>
            <hr />
            <a href="/hero" className='nav-link'>Hero</a>
            <hr />
            <a href="/" className='nav-link'>Courses</a>
            <hr />
            <a href="/training-mode" className='nav-link'>Traning Mode</a>
            <hr />
            <a href="/advantages" className='nav-link'>Advantages</a>
            <hr />
            <a href="/companies" className='nav-link'>Companies</a>
            <hr />
            <a href="/" className='nav-link'>Elite Program</a>
            <hr />
            <a href="/testimonials" className='nav-link'>Testimanials</a>
            <hr />
            <a href="/" className='nav-link'>Webinars</a>
            <hr />
            <a href="/youtube-videos" className='nav-link'>Youtube Videos</a>
            <hr />
            <a href="/blogs" className='nav-link'>Post Blogs</a>
            <hr />
            <a href="/" className='nav-link'></a>
            <hr />

        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideNav;