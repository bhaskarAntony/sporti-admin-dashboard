import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function SuccessPopup({show, close, title, desc, error}) {
  return (
    <div>
         <Modal show={show} onHide={close} centered>
        <Modal.Header closeButton className='border-0'>
          {/* <Modal.Title>{title}</Modal.Title> */}
        </Modal.Header>
        <Modal.Body className='text-center p-3'>
         {
          error?(
            <>
             <img src='https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png' alt="" className="w-50 m-auto rounded-4" />
          <h1 className="fs-3 mt-4 text-danger">{title}</h1>
          <p className="fs-5 text-secondary">{desc}</p>
            </>
          ):(
            <>
             <img src='https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png' alt="" className="w-50 m-auto rounded-4" />
          <h1 className="fs-3 mt-4 text-success">{title}</h1>
          <p className="fs-5 text-secondary">{desc}</p>
            </>
          )
         }
          {/* {
            next?(
                <Link to='/additional-details/123' className='blue-btn p-3 mb-3 d-block'>Next</Link>
            ):(null)
          } */}
          
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          
        </Modal.Footer> */}
      </Modal>
    </div>
  )
}

export default SuccessPopup