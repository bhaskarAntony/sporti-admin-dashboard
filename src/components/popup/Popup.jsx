import React from 'react'
import './style.css'

function Popup() {
  return (
    <div  className='popup-container'>
        <div className="row">
            <div className="col-12 col-md-5">
                <div className="popup-edit">

                </div>
            </div>
            <div className="col-12 col-md-7">
                <div className="popup">
                    <div className="popup-card">
                        <div className="popup-top">
                            <h1 className="fs-2"></h1>
                        </div>
                        <div className="popup-body">

                        </div>
                        <div className="popup-footer">
                            <button contentEditable="true">Create account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Popup