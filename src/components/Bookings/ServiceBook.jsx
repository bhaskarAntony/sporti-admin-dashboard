import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { Dropdown } from 'react-bootstrap';
// import './style.css'; // Include the CSS file
import Loading from '../popup/Loading';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

function sanitizeInput(input) {
    // First, sanitize HTML to prevent XSS
    let sanitized = DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });

    // Allow specific characters while removing others
    // Allow alphanumeric, space, @, ., -, _, and other specific symbols
    sanitized = sanitized.replace(/[^a-zA-Z0-9@._\- ]/g, '');

    return sanitized;
} 

function MainFunctionHallBooking() {
    const { sporti } = useParams();
    const [formData, setFormData] = useState({
        username: '',
        officerDesignation: '',
        officerCadre: '',
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
        sporti: sporti
    });

    const navigate = useNavigate();
    // const { openDialog } = useDialog();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [desc, setDesc] = useState(null);
    const [title, setTitle] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [perDayCost, setPerDayCost] = useState(0);

    useEffect(() => {
        const totalCost = calculateTotalCost();
        setFormData((prevFormData) => ({
            ...prevFormData,
            totalCost,
        }));
    }, [formData.roomType, formData.guestType, formData.noGuests, formData.checkInDate, formData.checkOutDate, formData.serviceName, formData.serviceType, numberOfDays]);


    const handleClose = () => {
        setShowModal(false);
    };

    const openModal = (title, desc) => {
        setShowModal(true);
        setDesc(desc);
        setTitle(title);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: sanitizeInput(value)
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

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Officer\'s name is required';
            isValid = false;
        }

        if (!formData.officerDesignation.trim()) {
            newErrors.officerDesignation = 'Designation is required';
            isValid = false;
        }

        if (!formData.officerCadre.trim()) {
            newErrors.officerCadre = 'Cadre is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number';
            isValid = false;
        }

        if (!formData.eventdate) {
            newErrors.eventdate = 'Event date is required';
            isValid = false;
        }

        if (!formData.serviceName) {
            newErrors.serviceName = 'Service name is required';
            isValid = false;
        }

        if (!formData.serviceType) {
            newErrors.serviceType = 'Service type is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const calculateTotalCost = () => {
        let baseCost = 0;

        if (formData.serviceName === 'main function hall') {
            switch (formData.serviceType) {
                case 'Others':
                    baseCost = 45000;
                    break;
                case 'Senior Police Officers of Other Govt Department':
                    baseCost = 25000;
                    break;
                case 'Serving and Senior Police Officers':
                    baseCost = 20000;
                    break;
                default:
                    baseCost = 0;
            }
        } else if (formData.serviceName === 'Conference  Room') {
            switch (formData.serviceType) {
                case 'Others':
                    baseCost = 15000;
                    break;
                case 'Senior Police Officers of Other Govt Department':
                    baseCost = 10000;
                    break;
                case 'Serving and Senior Police Officers':
                    baseCost = 7500;
                    break;
                default:
                    baseCost = 0;
            }
        } else if (formData.serviceName === 'Barbeque Area') {
            switch (formData.serviceType) {
                case 'Others':
                    baseCost = 10000;
                    break;
                case 'Senior Police Officers of Other Govt Department':
                    baseCost = 7500;
                    break;
                case 'Serving and Senior Police Officers':
                    baseCost = 5000;
                    break;
                default:
                    baseCost = 0;
            }
        }

        setPerDayCost(baseCost);
        return baseCost * numberOfDays;
    };

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
    };

    const translateToKannada = (text) => {
        // Dummy translation logic, replace with actual translation mechanism
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
        axios.post('https://sporti-backend-live.onrender.com/api/sporti/service/book', formData)
            .then(response => {
                const { success, user } = response.data;
                if (success) {
                    setIsLoading(false);
                    // openDialog('Success', `Your booking request has been sent to admin for confirmation and it takes one  working day  for the same. SMS will be sent to the registered mobile number. please note the  acknowledgement number for future  reference.  ApplicationNo is ${user.applicationNo} `, false);
                    // navigate(`/payment/${user.applicationNo}`);
                    toast.success('successfully added')
                } else {
                    setIsLoading(false);
                    toast.error('error, something went wrong please try again later..')
                    // openDialog('Error', 'something went wrong please try again later..', true);
                }
            })
            .catch((error) => {
                setIsLoading(false);
                // openDialog('Error', 'Booking Error', true);
                console.error('Error submitting form:', error);
            });
    };

    const generateDayOptions = () => {
        const options = [];
        for (let i = 0.5; i <= 20; i += 0.5) {
            options.push(
                <Dropdown.Item eventKey={i} key={i}>
                    {i} {i === 1 ? 'day' : 'days'}
                </Dropdown.Item>
            );
        }
        return options;
    };

    const handleDaySelection = (value) => {
        setNumberOfDays(parseFloat(value));
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className='main-function-hall-booking container-fluid p-2'>
            <div className="">
                <div className=" mx-auto">
                    <div className="bg-white rounded">
                   
                        <div className="">
                            <form onSubmit={submitForm}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">{selectedLanguage === 'kannada' ? translateToKannada('Officer\'s Name') : 'Officer\'s Name'}</label>
                                    <input type="text" className={`form-control ${errors.username && 'is-invalid'}`} id="username" name="username" value={formData.username} onChange={handleFormChange} />
                                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="officerDesignation" className="form-label">{selectedLanguage === 'kannada' ? translateToKannada('Designation') : 'Designation'}</label>
                                    <input type="text" className={`form-control ${errors.officerDesignation && 'is-invalid'}`} id="officerDesignation" name="officerDesignation" value={formData.officerDesignation} onChange={handleFormChange} />
                                    {errors.officerDesignation && <div className="invalid-feedback">{errors.officerDesignation}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="serviceType" className="form-label">{selectedLanguage === 'kannada' ? translateToKannada('Officers Category') : 'Officers Category'}</label>
                                    <Dropdown onSelect={(value) => handleDropdownChange('serviceType', value)}>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            {formData.serviceType || 'Select Type'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                        <Dropdown.Item eventKey="Serving and Senior Police Officers">Serving and Senior Police Officers</Dropdown.Item>
                                            <Dropdown.Item eventKey="Senior Police Officers of Other Govt Department">Senior Police Officers of Other Govt Department</Dropdown.Item>
                                          
                                            <Dropdown.Item eventKey="Others">Others</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {errors.serviceType && <div className="invalid-feedback d-block">{errors.serviceType}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="officerCadre" className="form-label">{selectedLanguage === 'kannada' ? translateToKannada('Officer Cadre (KA/No.KA)') : 'Officer Cadre (KA/No.KA)'}</label>
                                    <input type="text" className={`form-control ${errors.officerCadre && 'is-invalid'}`} id="officerCadre" name="officerCadre" value={formData.officerCadre} onChange={handleFormChange} />
                                    {errors.officerCadre && <div className="invalid-feedback">{errors.officerCadre}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">{selectedLanguage === 'kannada' ? translateToKannada('Email') : 'Email'}</label>
                                    <input type="email" className={`form-control ${errors.email && 'is-invalid'}`} id="email" name="email" value={formData.email} onChange={handleFormChange} />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">{selectedLanguage === 'kannada' ? translateToKannada('Phone Number') : 'Phone Number'}</label>
                                    <input type="text" className={`form-control ${errors.phoneNumber && 'is-invalid'}`} id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} />
                                    {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="eventdate" className="form-label">{selectedLanguage === 'kannada' ? translateToKannada('Event start date') : 'Event start date'}</label>
                                    <input type="date" className={`form-control ${errors.eventdate && 'is-invalid'}`} id="eventdate" name="eventdate" value={formData.eventdate} onChange={handleFormChange} />
                                    {errors.eventdate && <div className="invalid-feedback">{errors.eventdate}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="serviceName" className="form-label">{selectedLanguage === 'kannada' ? translateToKannada('Hall type') : 'Hall type'}</label>
                                    <Dropdown onSelect={(value) => handleDropdownChange('serviceName', value)}>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            {formData.serviceName || 'Select Service'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="main function hall">main function hall</Dropdown.Item>
                                            <Dropdown.Item eventKey="Conference  Room">Conference  Room</Dropdown.Item>
                                            <Dropdown.Item eventKey="Barbeque Area">Barbeque Area</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {errors.serviceName && <div className="invalid-feedback d-block">{errors.serviceName}</div>}
                                </div>
                              
                                <div className="mb-3">
                                    <label htmlFor="noGuests" className="form-label">{selectedLanguage === 'kannada' ? translateToKannada('Approximate No of guests') : 'Approximate No of guests'}</label>
                                    <input type="number" className="form-control" id="noGuests" name="noGuests" value={formData.noGuests} onChange={handleFormChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="numberOfDays" className="form-label">Number of Days</label>
                                    <Dropdown onSelect={handleDaySelection}>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic" className='form-control border'>
                                            {numberOfDays || 'Select Number of Days'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {generateDayOptions()}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="totalCost" className="form-label">{selectedLanguage === 'kannada' ? translateToKannada('Total Cost (₹)') : 'Total Cost (₹)'}</label>
                                    <input type="text" className="form-control" id="totalCost" name="totalCost" value={formData.totalCost} readOnly />
                                </div>
                                <div className="d-flex justify-content-end">
                            <button type="submit" className="blue-btn rounded-1 m-1">{selectedLanguage === 'kannada' ? translateToKannada('Submit') : 'Submit'}</button>
                            <button type="button" className="btn btn-danger m-1 rounded-1" onClick={() => navigate('/services')}>{selectedLanguage === 'kannada' ? translateToKannada('Cancel') : 'Cancel'}</button>
                        </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainFunctionHallBooking;
