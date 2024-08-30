import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Loading from '../popup/Loading';
import { toast } from 'react-toastify';

function sanitizeInput(input, field) {
    let sanitized = DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });
    if (field === 'checkIn' || field === 'checkOut') {
        return input;
    }
    if (field === 'email') {
        sanitized = sanitized.replace(/[^a-zA-Z0-9@._-]/g, '');
    } else if (field === 'phoneNumber' || field === 'noGuests') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
    } else {
        sanitized = sanitized.replace(/[^a-zA-Z0-9 ]/g, '');
    }
    return sanitized;
}



function EditRoom() { 
    const {applicationNo} = useParams();  
    const [isKannada, setIsKannada] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        officerDesignation: '',
        officerCadre: 'none',
        email: '',
        phoneNumber: '',
        checkIn: '',
        checkOut: '',
        sporti: '',
        serviceType: '',
        serviceName: 'Room Booking',
        roomType: '',
        noGuests: 1,
        guestType:'',
        roomId:'',
        selectedRoomNumber:''
    });
    const location = useLocation();

    useEffect(()=>{
       const fetchData = async() =>{
        try {
            const res = await axios.get(`https://sporti-backend-live-p00l.onrender.com/api/sporti/service/booking/${applicationNo}`)
            console.log(res);
            setFormData({...formData, ...res.data.booking})
            
        } catch (error) {
            console.log(error);
            
        }
       }
       fetchData();


    }, [])
    
    useEffect(()=>{
        localStorage.setItem('roombooking', JSON.stringify(formData))
    }, [formData])

   

    // useEffect(()=>{
    //    if(location.state){
    //     setFormData({...location.state.backupData})
    //    }
    // }, [location.state])

    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [desc, setDesc] = useState(null);
    const [title, setTitle] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    useEffect(()=>{
        setSelectedLanguage(isKannada?"kannada":"english")
    }, [isKannada])

    const handleClose = () => {
        setShowModal(false);
    };

    const openModal = (title, desc) => {
        setShowModal(true);
        setDesc(desc);
        setTitle(title);
    };

    const navigate = useNavigate();

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: sanitizeInput(value, name)
        });
        setErrors({
            ...errors,
            [name]: ''
        });
    };

    const handleDropdownChange = (name, value) => {
        setFormData({
            ...formData,
            [name]:value
        });
        setErrors({
            ...errors,
            [name]: ''
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = selectedLanguage === 'kannada' ? 'ಹೆಸರು ಅಗತ್ಯವಿದೆ' : 'Username is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = selectedLanguage === 'kannada' ? 'ಇಮೇಲ್ ಅಗತ್ಯವಿದೆ' : 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = selectedLanguage === 'kannada' ? 'ಅಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ' : 'Invalid email address';
        }
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = selectedLanguage === 'kannada' ? 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ' : 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = selectedLanguage === 'kannada' ? 'ಅಮಾನ್ಯ ದೂರವಾಣಿ ಸಂಖ್ಯೆ' : 'Invalid phone number';
        }
        if (!formData.sporti) {
            newErrors.sporti = selectedLanguage === 'kannada' ? 'SPORTI ಆಯ್ಕೆ ಅಗತ್ಯವಿದೆ' : 'SPORTI selection is required';
        }
        if (!formData.officerDesignation) {
            newErrors.officerDesignation = selectedLanguage === 'kannada' ? 'ಅಧಿಕಾರಿಯ ಹುದ್ದೆ ಅಗತ್ಯವಿದೆ' : 'Officer Designation is required';
        }
        if (!formData.officerCadre) {
            newErrors.officerCadre = selectedLanguage === 'kannada' ? 'ಅಧಿಕಾರಿಯ ತರಗತಿ ಅಗತ್ಯವಿದೆ' : 'Officer Cadre is required';
        }
        if (!formData.roomType) {
            newErrors.roomType = selectedLanguage === 'kannada' ? 'ಕೋಣೆ ಪ್ರಕಾರ ಆಯ್ಕೆ ಅಗತ್ಯವಿದೆ' : 'Room type selection is required';
        }
        if (!formData.checkIn) {
            newErrors.checkIn = selectedLanguage === 'kannada' ? 'ಪರಿಶೀಲನೆದ ದಿನಾಂಕ ಮತ್ತು ಸಮಯ ಅಗತ್ಯವಿದೆ' : 'Check-in date and time are required';
        }
        if (!formData.checkOut) {
            newErrors.checkOut = selectedLanguage === 'kannada' ? 'ಚೆಕ್-ಔಟ್ ದಿನಾಂಕ ಮತ್ತು ಸಮಯ ಅಗತ್ಯವಿದೆ' : 'Check-out date and time are required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const today = new Date().toISOString().split('T')[0];

  

    const renderRoomTypes = () => {
        if (formData.sporti === 'SPORTI-1') {
            return (
                <>
                    <Dropdown.Item eventKey="Family">{selectedLanguage === 'kannada' ? 'ಕುಟುಂಬ' : 'Family'}</Dropdown.Item>
                    <Dropdown.Item eventKey="VIP">{selectedLanguage === 'kannada' ? 'ವಿಐಪಿ' : 'Suite (ADGP & Above)'}</Dropdown.Item>
                    <Dropdown.Item eventKey="Standard">{selectedLanguage === 'kannada' ? 'ಸಾಮಾನ್ಯ' : 'Standard'}</Dropdown.Item>
                </>
            );
        } else if (formData.sporti === 'SPORTI-2') {
            return (
                <>
                 <Dropdown.Item eventKey="Family">{selectedLanguage === 'kannada' ? 'ಕುಟುಂಬ' : 'Family'}</Dropdown.Item>
                 <Dropdown.Item eventKey="Standard">{selectedLanguage === 'kannada' ? 'ಸಾಮಾನ್ಯ' : 'Standard'}</Dropdown.Item>
                   
                </>
            );
        } else {
            return null;
        }
    };

  

    const submitForm = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);//https://sporti-backend-live.onrender.com
        axios.post('https://sporti-backend-live-p00l.onrender.com/api/sporti/service/room/book', formData)
            .then(response => {
                const { success, user } = response.data;
                if (success) {
                    setIsLoading(false);
                   toast.success(`Your booking request has been sent to the administrator. You will receive an email and SMS. It takes one working day for confirmation SMS. Please note your Booking ID No ${response.applicationNo} for reference`)
                    console.log(response);
                    
                    // navigate('/');
                } else {
                    setIsLoading(false);
                   toast.error('Booking failed, please try again.')
                }
            })
            .catch(error => {
                setIsLoading(false);
               toast.error('Booking failed, please try again.')
            });
    };
    if(isLoading){
        return <Loading/>
    }
    const ConfirmDetails = () =>{
        if (!validateForm()) {
            return;
        }
      navigate('/confirm/room/details', { state: {data:formData } });
    }  


    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    const currentDateTime = new Date().toISOString().split('T')[0];
    return (
        <div className='main-function-hall-booking container-fluid p-1 p-md-5 form'>
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="bg-white rounded">
                    <div className="bg-main p-3 text-center">
                        <h1 className="fs-3 text-light">{selectedLanguage === 'kannada' ? ' Room  ಬುಕ್ಕಿಂಗ್ ವೇಳಾಪಟ್ಟಿ' : 'SPORTI Room Booking Form'}</h1>
                        {/* <p className="text-light">
                            {selectedLanguage === 'kannada' ? 'ಈ ಫಾರಂ ಅಧಿಕಾರಿಗಳಿಗೆ ಇತರ ಸಲಹೆಗಳಿಗಾಗಿ ಭಾವಿಸುವುದಿಲ್ಲ' : 'This form is for booking rooms in the SPORTI'}
                        </p> */}
                        <div className="d-flex justify-content-end">
                   <Dropdown onSelect={(value) => setSelectedLanguage(value)} className='w-auto'>
                        <Dropdown.Toggle variant="secondary" id="dropdown-language">
                            {selectedLanguage === 'kannada' ? 'ಕನ್ನಡ' : 'English'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="english">English</Dropdown.Item>
                            <Dropdown.Item eventKey="kannada">ಕನ್ನಡ</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                   </div>
                    </div>
                        
              <div className="p-3">
              <form onSubmit={submitForm}>
                    <div className="form-group mt-3">
                        <span htmlFor="username">{selectedLanguage === 'kannada' ? 'ಹೆಸರು' : 'Name'}</span>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleFormChange}
                            placeholder={selectedLanguage === 'kannada' ? 'ನಿಮ್ಮ ಹೆಸರು ಪ್ರವೇಶಿಸಿ' : 'Enter your name'}
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    <div className="form-group mt-3">
                        <span htmlFor="officerDesignation">{selectedLanguage === 'kannada' ? 'ಅಧಿಕಾರಿಯ ಹುದ್ದೆ' : 'Officer Designation'}</span>
                        <input
                            type="text"
                            id="officerDesignation"
                            name="officerDesignation"
                            value={formData.officerDesignation}
                            onChange={handleFormChange}
                            placeholder={selectedLanguage === 'kannada' ? 'ಅಧಿಕಾರಿಯ ಹುದ್ದೆ ನಮೂದಿಸಿ' : 'Enter Officer Designation'}
                            className={`form-control ${errors.officerDesignation ? 'is-invalid' : ''}`}
                        />
                        {errors.officerDesignation && <div className="invalid-feedback">{errors.officerDesignation}</div>}
                    </div>
                    <div className="col-md-6">
                            <div className="form-group mt-3">
                                <span htmlFor="guestType" className="form-span">
                                    {selectedLanguage === 'kannada' ? 'ಅತಿಥಿ ಪ್ರಕಾರ' : 'Officers Category'}
                                </span>
                                <Dropdown onSelect={(value) => handleDropdownChange('serviceType', value)} className="w-100">
                                    <Dropdown.Toggle variant="secondary" id="dropdown-guestType" className="w-100">
                                        {formData.serviceType || (selectedLanguage === 'kannada' ? 'ಅತಿಥಿ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ' : 'Select Officers Category')}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item eventKey="Officers from Karnataka State">
                                            {selectedLanguage === 'kannada' ? 'ಕರ್ನಾಟಕದ ಅಧಿಕಾರಿಗಳು' : 'Officers from Karnataka State'}
                                        </Dropdown.Item>
                                        <Dropdown.Item eventKey="Officers from Other State">
                                            {selectedLanguage === 'kannada' ? 'ಇತರೆ ರಾಜ್ಯಗಳ ಅಧಿಕಾರಿಗಳು' : ' ⁠Officers from other Cadres'}
                                        </Dropdown.Item>
                                        <Dropdown.Item eventKey="Others">
                                            {selectedLanguage === 'kannada' ? 'ಇತರೆ' : 'Others'}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                {errors.serviceType && <small className="text-danger">{errors.serviceType}</small>}
                            </div>
                        </div>
                    {/* <div className="form-group mt-3">
                        <span htmlFor="officerCadre">{selectedLanguage === 'kannada' ? 'ಅಧಿಕಾರಿಯ ತರಗತಿ' : 'Officer Cadre'}</span>
                        <input
                            type="text"
                            id="officerCadre"
                            name="officerCadre"
                            value={formData.officerCadre}
                            onChange={handleFormChange}
                            placeholder={selectedLanguage === 'kannada' ? 'ಅಧಿಕಾರಿಯ ತರಗತಿ ನಮೂದಿಸಿ' : 'Enter Officer Cadre'}
                            className={`form-control ${errors.officerCadre ? 'is-invalid' : ''}`}
                        />
                        {errors.officerCadre && <div className="invalid-feedback">{errors.officerCadre}</div>}
                    </div> */}
                    <div className="form-group mt-3">
                        <span htmlFor="email">{selectedLanguage === 'kannada' ? 'ಇಮೇಲ್' : 'Email'}</span>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder={selectedLanguage === 'kannada' ? 'ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ' : 'Enter your email address'}
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="form-group mt-3">
                        <span htmlFor="phoneNumber">{selectedLanguage === 'kannada' ? 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ' : 'Phone Number'}</span>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleFormChange}
                            placeholder={selectedLanguage === 'kannada' ? 'ನಿಮ್ಮ ದೂರವಾಣಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ' : 'Enter your phone number'}
                            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                        />
                        {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                    </div>
                    <div className="form-group mt-3">
                        <span htmlFor="checkIn">{selectedLanguage === 'kannada' ? 'ಪರಿಶೀಲನೆ' : 'Check-In'}</span>
                        <input
                            type="datetime-local"
                            id="checkIn"
                            name="checkIn"
                            min={currentDateTime}
                            value={formData.checkIn}
                            onChange={handleFormChange}
                            className={`form-control ${errors.checkIn ? 'is-invalid' : ''}`}
                        />
                        {errors.checkIn && <div className="invalid-feedback">{errors.checkIn}</div>}
                    </div>
                    <div className="form-group mt-3">
                        <span htmlFor="checkOut">{selectedLanguage === 'kannada' ? 'ಚೆಕ್-ಔಟ್' : 'Check-Out'}</span>
                        <input
                            type="datetime-local"
                            id="checkOut"
                            name="checkOut"
                            min={currentDateTime}
                            value={formData.checkOut}
                            onChange={handleFormChange}
                            className={`form-control ${errors.checkOut ? 'is-invalid' : ''}`}
                        />
                        {errors.checkOut && <div className="invalid-feedback">{errors.checkOut}</div>}
                    </div>
                    <div className="form-group mt-3">
                        <span htmlFor="sporti">{selectedLanguage === 'kannada' ? 'SPORTI' : 'SPORTI'}</span>
                        <Dropdown onSelect={(value) => handleDropdownChange('sporti', value)}>
                            <Dropdown.Toggle variant="success" id="sporti-dropdown">
                                {formData.sporti || (selectedLanguage === 'kannada' ? 'ಆಯ್ಕೆ ಮಾಡಿ' : 'Select')}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="SPORTI-1">{selectedLanguage === 'kannada' ? 'SPORTI-1' : 'SPORTI-1'}</Dropdown.Item>
                                <Dropdown.Item eventKey="SPORTI-2">{selectedLanguage === 'kannada' ? 'SPORTI-2' : 'SPORTI-2'}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        {errors.sporti && <div className="invalid-feedback">{errors.sporti}</div>}
                    </div>
                    <div className="form-group mt-3">
                        <span htmlFor="roomType">{selectedLanguage === 'kannada' ? 'ಕೋಣೆ ಪ್ರಕಾರ' : 'Room Type'}</span>
                        <Dropdown onSelect={(value) => handleDropdownChange('roomType', value)}>
                            <Dropdown.Toggle variant="success" id="roomType-dropdown">
                                {formData.roomType || (selectedLanguage === 'kannada' ? 'ಆಯ್ಕೆ ಮಾಡಿ' : 'Select')}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {renderRoomTypes()}
                            </Dropdown.Menu>
                        </Dropdown>
                        {errors.roomType && <div className="invalid-feedback">{errors.roomType}</div>}
                    </div>
                    <div className="form-group mt-3">
                        <span htmlFor="noGuests">{selectedLanguage === 'kannada' ? 'ಅತಿಥಿಗಳು' : 'Guests'}</span>
                        <input
                            type="number"
                            id="noGuests"
                            name="noGuests"
                            value={formData.noGuests}
                            onChange={handleFormChange}
                            min="1"
                            className={`form-control ${errors.noGuests ? 'is-invalid' : ''}`}
                        />
                        {errors.noGuests && <div className="invalid-feedback">{errors.noGuests}</div>}
                    </div>
                   <div className="col-md-12">
                   <div className="room-no">
                        <p className="fs-5">Room No: </p>
                        <button className='btn btn-secondary'>Room {formData.selectedRoomNumber}</button>
                    </div>
                   </div>
                   
                    <div className="col-md-12 text-center mt-4 d-flex gap-3 justify-content-end">
                                    <button type="button"  className="main-btn rounded-1 m-0" onClick={ConfirmDetails}>
                                        {selectedLanguage === 'english' ? 'Submit' : 'ಸಲ್ಲಿಸಿ'}
                                    </button>
                                    <button type="button" className="btn btn-danger rounded-1 ms-2" onClick={() => navigate('/')}>
                                        {selectedLanguage === 'english' ? 'Cancel' : "ರದ್ದುಮಾಡಿ"}
                                    </button>
                                </div>
                </form>
              </div>
            </div>
        </div>
        </div>
        </div>
    );
}

export default EditRoom;