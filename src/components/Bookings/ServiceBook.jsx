import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import './style.css'; // Include the CSS file
import DOMPurify from 'dompurify';
import Loading from '../popup/Loading';
import { toast } from 'react-toastify';

function sanitizeInput(input, field) {
    // First, sanitize HTML to prevent XSS
    let sanitized = DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });

    if (field === 'eventdate') {
        return input; // Assume date format is controlled by the <input> element
    }
    // Allow specific characters while removing others
    if (field === 'email') {
        // Allow alphanumeric, @, ., and -
        sanitized = sanitized.replace(/[^a-zA-Z0-9@._-]/g, '');
    } else if (field === 'phoneNumber' || field === 'noGuests') {
        // Allow only numbers
        sanitized = sanitized.replace(/[^0-9]/g, '');
    } else {
        // Allow alphanumeric and space
        sanitized = sanitized.replace(/[^a-zA-Z0-9 ]/g, '');
    }

    return sanitized;
}

function MainFunctionHallBooking() {
  
    const { sporti } = useParams();
    const navigate = useNavigate();
    const [isKannada, setIsKannada] = useState(false)
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [desc, setDesc] = useState(null);
    const [title, setTitle] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [perDayCost, setPerDayCost] = useState(0);
    const [formData, setFormData] = useState({
        username: '',
        officerDesignation: '',
        officerCadre: 'none',
        email: '',
        phoneNumber: '',
        checkInDate: '',
        checkOutDate: '',
        serviceType: '',
        serviceName: '',
        roomType: '',
        noGuests: 1,
        totalCost: 0,
        applicationNo: '',
        eventdate: '',
        sporti: sporti,
        numberOfDays:numberOfDays
    });

    useEffect(()=>{
        const savedData = localStorage.getItem('servicebooking');
        if(savedData){
            setFormData(JSON.parse(savedData))
        }
    }, [])
    
    useEffect(()=>{
        localStorage.setItem('servicebooking', JSON.stringify(formData))
    }, [formData])

    const handleClose = () => {
        setShowModal(false);
    };
    const today = new Date().toISOString().split('T')[0];

    useEffect(()=>{
        setSelectedLanguage(isKannada?"kannada":"english")
    }, [isKannada])

    const openModal = (title, desc) => {
        setShowModal(true);
        setDesc(desc);
        setTitle(title);
    };

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
            [name]: sanitizeInput(value)
        });
        setErrors({
            ...errors,
            [name]: ''
        });
    };
    const handleDaySelection = (value) => {
        setNumberOfDays(parseFloat(value));
        setFormData({...formData, "numberOfDays":parseFloat(value)})
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = selectedLanguage === 'english' ? 'Officer\'s name is required' : 'ಅಧಿಕಾರಿಗಳ ಹೆಸರು ಅಗತ್ಯವಿದೆ';
            isValid = false;
        }

        if (!formData.officerDesignation.trim()) {
            newErrors.officerDesignation = selectedLanguage === 'english' ? 'Designation is required' : 'ಹುದ್ದೆ ಅಗತ್ಯವಿದೆ';
            isValid = false;
        }

        if (!formData.officerCadre.trim()) {
            newErrors.officerCadre = selectedLanguage === 'english' ? 'Cadre is required' : 'ಶ್ರೇಣಿ ಅಗತ್ಯವಿದೆ';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = selectedLanguage === 'english' ? 'Email is required' : 'ಇಮೇಲ್ ಅಗತ್ಯವಿದೆ';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = selectedLanguage === 'english' ? 'Invalid email address' : 'ಅಸರಿ ಇಮೇಲ್ ವಿಳಾಸ';
            isValid = false;
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = selectedLanguage === 'english' ? 'Phone number is required' : 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = selectedLanguage === 'english' ? 'Invalid phone number' : 'ಅಸರಿ ದೂರವಾಣಿ ಸಂಖ್ಯೆ';
            isValid = false;
        }

        if (!formData.eventdate) {
            newErrors.eventdate = selectedLanguage === 'english' ? 'Event date is required' : 'ಈವೆಂಟ್ ದಿನಾಂಕ ಅಗತ್ಯವಿದೆ';
            isValid = false;
        }

        if (!formData.serviceName) {
            newErrors.serviceName = selectedLanguage === 'english' ? 'Service name is required' : 'ಸೇವೆಯ ಹೆಸರು ಅಗತ್ಯವಿದೆ';
            isValid = false;
        }

        if (!formData.serviceType) {
            newErrors.serviceType = selectedLanguage === 'english' ? 'Service type is required' : 'ಸೇವೆಯ ಪ್ರಕಾರ ಅಗತ್ಯವಿದೆ';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
    };

    const translateToKannada = (text) => {
        switch (text) {
            case 'Officer\'s Name':
                return 'ಅಧಿಕಾರಿಗಳ ಹೆಸರು';
            case 'Designation':
                return 'ಹುದ್ದೆ';
            case 'Cadre':
                return 'ಶ್ರೇಣಿ';
            case 'Email':
                return 'ಇಮೇಲ್';
            case 'Phone Number':
                return 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ';
            case 'Event start date':
                return 'ಈವೆಂಟ್ ಪ್ರಾರಂಭ ದಿನಾಂಕ';
            case 'Event end date':
                return 'ಈವೆಂಟ್ ಕೊನೆ ದಿನಾಂಕ';
            case 'Officers Category':
                return 'ಅಧಿಕಾರಿಗಳ ವರ್ಗ';
            case 'Hall type':
                return 'ಹಾಲ್ ಪ್ರಕಾರ';
            case 'Approximate No of guests':
                return 'ಅಂದಾಜು ಅತಿಥಿಗಳ ಸಂಖ್ಯೆ';
            case 'Total Cost (₹)':
                return 'ಒಟ್ಟು ವೆಚ್ಚ (₹)';
            case 'Submit':
                return 'ಸಲ್ಲಿಸಿ';
            case 'Cancel':
                return 'ರದ್ದುಮಾಡಿ';
            default:
                return text;
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        axios.post('https://sporti-backend-live-1.onrender.com/api/sporti/service/service/book', formData)
            .then(response => {
                const { success, user } = response.data;
                if (success) {
                    setIsLoading(false);
                   toast.error(`Your booking request has been sent to admin for confirmation and it takes one working day for the same. SMS will be sent to the registered mobile number. Please note the acknowledgement number for future reference. ApplicationNo is ${user.applicationNo}`)
                    navigate(`/`);
                } else {
                    setIsLoading(false);
                  toast.error('Something went wrong, please try again later.')
                }
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error('Booking Error', error.message);
            });
    };

 

    const generateDayOptions = () => {
        const options = [];
        for (let i = 0.5; i <= 20; i += 0.5) {
            options.push(
                <Dropdown.Item eventKey={i} key={i}>
                    {i} {i === 1 ? (selectedLanguage === 'english' ? 'day' : 'ದಿನ') : (selectedLanguage === 'english' ? 'days' : 'ದಿನಗಳು')}
                </Dropdown.Item>
            );
        }
        return options;
    };
    if(isLoading){
        return <Loading/>
    }
    const ConfirmDetails = (e) =>{
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
      navigate('/confirm/service', { state: {data:formData } });
    } 

    return (
        <div className='main-function-hall-booking container-fluid p-1 p-md-5 form'>
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="bg-white rounded">
                        <div className="bg-main p-3 text-center">
                            <h3 className='m-0 text-center fs-2 mb-3 text-light'>
                                {selectedLanguage === 'english' ? 'SPORTI Services Booking' : 'ಸ್ಪೋರ್ಸ್ಟಿ ಸೇವೆಗಳ ಬುಕ್ಕಿಂಗ್'}
                            </h3>
                            {/* <p className="text-light">
                                {selectedLanguage === 'kannada' ? 'ಈ ಫಾರಂ ಅಧಿಕಾರಿಗಳಿಗೆ ಇತರ ಸಲಹೆಗಳಿಂದ ಬಹುಮಾನಗಳನ್ನು ಪುಡಿಸುವ ಅವಕಾಶವನ್ನು ಒದಗಿಸುತ್ತದೆ.' : 'This form provides an opportunity for officers to book various services offered through the department.'}
                            </p> */}
                            <div className="d-flex justify-content-end">
                                <Dropdown onSelect={handleLanguageChange} className='w-auto'>
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
                        <form onSubmit={ConfirmDetails} className="p-2 p-md-4">
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="username" className="form-label">
                                        {selectedLanguage === 'english' ? 'Officer\'s Name' : translateToKannada('Officer\'s Name')}
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleFormChange}
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        />
                                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="officerDesignation" className="form-label">
                                        {selectedLanguage === 'english' ? 'Designation' : translateToKannada('Designation')}
                                    </label>
                                    <input
                                        type="text"
                                        id="officerDesignation"
                                        name="officerDesignation"
                                        value={formData.officerDesignation}
                                        onChange={handleFormChange}
                                        className={`form-control ${errors.officerDesignation ? 'is-invalid' : ''}`}
                                        />
                                        {errors.officerDesignation && <div className="invalid-feedback">{errors.officerDesignation}</div>}
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label htmlFor="serviceType" className="form-label">
                                        {selectedLanguage === 'english' ? 'Officers Category' : translateToKannada('Officers Category')}
                                    </label>
                                    <Dropdown onSelect={(value) => handleDropdownChange('serviceType', value)}>
                                        <Dropdown.Toggle variant="success" id="dropdown-serviceType">
                                            {formData.serviceType || (selectedLanguage === 'english' ? 'Select Officers Category' : 'ಅಧಿಕಾರಿಗಳ ವರ್ಗ ಆಯ್ಕೆಮಾಡಿ')}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="Officers from Karnataka State">Serving and Retired Officers of Karnataka Cadre</Dropdown.Item>
                                            <Dropdown.Item eventKey="Officers from Other State">⁠Officers from other Cadres</Dropdown.Item>
                                            <Dropdown.Item eventKey="Others">Others</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {errors.serviceType && <div className="text-danger">{errors.serviceType}</div>}
                                </div>
                                {/* <div className="col-md-12 mb-3">
                                    <label htmlFor="officerCadre" className="form-label">
                                        {selectedLanguage === 'english' ? 'Cadre' : translateToKannada('Cadre')}
                                    </label>
                                    <input
                                        type="text"
                                        id="officerCadre"
                                        name="officerCadre"
                                        value={formData.officerCadre}
                                        onChange={handleFormChange}
                                        className={`form-control ${errors.officerCadre ? 'is-invalid' : ''}`}
                                        />
                                        {errors.officerCadre && <div className="invalid-feedback">{errors.officerCadre}</div>}
                                </div> */}
                                
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="email" className="form-label">
                                        {selectedLanguage === 'english' ? 'Email' : translateToKannada('Email')}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">
                                        {selectedLanguage === 'english' ? 'Phone Number' : translateToKannada('Phone Number')}
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleFormChange}
                                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                        />
                                        {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="eventdate" className="form-label">
                                        {selectedLanguage === 'english' ? 'Event start date' : translateToKannada('Event start date')}
                                    </label>
                                    <input
                                        type="date"
                                        id="eventdate"
                                        min={today}
                                        name="eventdate"
                                        value={formData.eventdate}
                                        onChange={handleFormChange}
                                        className={`form-control ${errors.eventdate ? 'is-invalid' : ''}`}
                                        />
                                        {errors.eventdate && <div className="invalid-feedback">{errors.eventdate}</div>}
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="serviceName" className="form-label">
                                        {selectedLanguage === 'english' ? 'Hall Type' : translateToKannada('Hall type')}
                                    </label>
                                    <Dropdown onSelect={(value) => handleDropdownChange('serviceName', value)}>
                                        <Dropdown.Toggle variant="success" id="dropdown-serviceName">
                                            {formData.serviceName === "" ? (selectedLanguage === 'english' ? 'Select Hall Type' : 'ಹಾಲ್ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ') : formData.serviceName}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="Conference Room">Conference Room</Dropdown.Item>
                                            <Dropdown.Item eventKey="Main Function Hall">Main Function Hall</Dropdown.Item>
                                            <Dropdown.Item eventKey="Barbeque Area">Barbeque Area</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {errors.serviceName && <div className="text-danger">{errors.serviceName}</div>}
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="numberOfDays" className="form-label">
                                        {selectedLanguage === 'english' ? 'Number of days' : translateToKannada('Number of days')}
                                    </label>
                                    <Dropdown onSelect={handleDaySelection}>
                                        <Dropdown.Toggle variant="success" id="dropdown-numberOfDays">
                                            {formData.numberOfDays || (selectedLanguage === 'english' ? 'Select Number of Days' : 'ದಿನಗಳ ಸಂಖ್ಯೆ ಆಯ್ಕೆಮಾಡಿ')}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {generateDayOptions()}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {errors.numberOfDays && <div className="text-danger">{errors.numberOfDays}</div>}
                                </div>
                                {/* <div className="col-md-12 mb-3">
                                    <label htmlFor="totalCost" className="form-label">
                                        {selectedLanguage === 'english' ? 'Total Cost (₹)' : translateToKannada('Total Cost (₹)')}
                                    </label>
                                    <input
                                        type="text"
                                        id="totalCost"
                                        name="totalCost"
                                        value={formData.totalCost}
                                        onChange={handleFormChange}
                                        className="form-control"
                                        readOnly
                                    />
                                </div> */}

                                <div className="col-md-12 text-center mt-4 d-flex gap-3 justify-content-end">
                                    <button  type="submit" className="main-btn rounded-1 m-0">
                                        {selectedLanguage === 'english' ? 'Submit' : translateToKannada('Submit')}
                                    </button>
                                    <button type="button" className="btn btn-danger rounded-1 ms-2" onClick={() => navigate('/')}>
                                        {selectedLanguage === 'english' ? 'Cancel' : translateToKannada('Cancel')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

          

            {/* <Loading show={isLoading} /> */}
        </div>
    );
}

export default MainFunctionHallBooking;