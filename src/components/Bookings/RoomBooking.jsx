import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { useDialog } from '../../popups/DialogContext';
import Loading from '../popup/Loading';
import SuccessPopup from '../../popups/SuccessPopup';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

function sanitizeInput(input) {
    return DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });
} 
function MainRoomBook() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        officerDesignation: '',
        officerCadre: '',
        email: '',
        phoneNumber: '',
        checkIn: '',
        checkOut: '',
        sporti: '',
        serviceType: '',
        serviceName:'Room Booking',
        roomType: '',
        noGuests: 1,
        totalCost: 0,
    });

    const [errors, setErrors] = useState({});
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
    }, [formData.roomType, formData.guestType, formData.noGuests, formData.checkIn, formData.checkOut]);


    const handleClose = () => {
        setShowModal(false);
    };

    const openModal = (title, desc) => {
        setShowModal(true);
        setDesc(sanitizeInput(desc));
        setTitle(sanitizeInput(title));
    };
    const navigate = useNavigate()
    // const { openDialog } = useDialog();


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
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number';
        }

        if (!formData.sporti) {
            newErrors.sporti = 'SPORTI selection is required';
        }

        if (!formData.roomType) {
            newErrors.roomType = 'Room type selection is required';
        }

        if (!formData.guestType) {
            newErrors.guestType = 'Guest type selection is required';
        }

        if (!formData.checkIn) {
            newErrors.checkIn = 'Check-in date and time are required';
        }

        if (!formData.checkOut) {
            newErrors.checkOut = 'Check-out date and time are required';
        }

        if (!formData.officerDesignation.trim()) {
            newErrors.officerDesignation = 'Officer Designation is required';
        }

        if (!formData.officerCadre.trim()) {
            newErrors.officerCadre = 'Officer Cadre is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const calculateTotalCost = () => {
        let roomPrice = 0;

        switch (formData.roomType) {
            case 'Family':
                if (formData.guestType === 'Officers from Karnataka') {
                    roomPrice = 1600;
                } else if (formData.guestType === 'Officers from Other States') {
                    roomPrice = 2100;
                }
                else if (formData.guestType === 'Serving and Senior Police Officers') {
                    roomPrice = 1600;
                }
                break;
            case 'VIP':
                if (formData.guestType === 'Officers from Karnataka') {
                    roomPrice = 1300;
                } else if (formData.guestType === 'Officers from Other States') {
                    roomPrice = 1600;
                } else if (formData.guestType === 'Serving and Senior Police Officers') {
                    roomPrice = 2700;
                }
                break;
            case 'Standard':
                if (formData.guestType === 'Officers from Karnataka') {
                    roomPrice = 800;
                } else if (formData.guestType === 'Officers from Other States') {
                    roomPrice = 1100;
                } else if (formData.guestType === 'Serving and Senior Police Officers') {
                    roomPrice = 1600;
                }
                break;
            default:
                roomPrice = 0;
        }

        setPerDayCost(roomPrice);

        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        const diffTime = Math.abs(checkOutDate - checkInDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setNumberOfDays(diffDays);

        return roomPrice * formData.noGuests * diffDays;
    };


    const renderRoomTypes = () => {
        if (formData.sporti === 'SPORTI-1' || formData.sporti === 'SPORTI-2') {
            return (
                <>
                    <Dropdown.Item eventKey="Family">{selectedLanguage === 'kannada' ? 'ಕುಟುಂಬ' : 'Family'}</Dropdown.Item>
                    <Dropdown.Item eventKey="VIP">{selectedLanguage === 'kannada' ? 'ವಿಐಪಿ' : 'VIP'}</Dropdown.Item>
                    <Dropdown.Item eventKey="Standard">{selectedLanguage === 'kannada' ? 'ಸಾಮಾನ್ಯ' : 'Standard'}</Dropdown.Item>
                </>
            );
        } else {
            return null;
        }
    };

    const generateHash512 = (text) => {
        const hash = CryptoJS.SHA512(text);
        return hash.toString(CryptoJS.enc.Hex);
    };

    const createPaymentForm = () => {
        const requestData = {
            K1USRID: 'K1SPOTIUSER',
            K1PWD: '39d16932b27ba15a4c77fd09f8817b2dbce0089dfd45b602fdad8881127002560c5249a77c9dce96fc88a035a1393553ca80f1196b2f89a27b701525533fc55c',
            Name: formData.username,
            AppNo: 'MD89786',
            Email: formData.email,
            Phone: formData.phoneNumber,
            ProductInfo: formData.roomType,
            AmountPaid: calculateTotalCost()
        };

        const requestDataString = `K1USRID=${requestData.K1USRID}|K1PWD=${requestData.K1PWD}|Name=${requestData.Name}|AppNo=${requestData.AppNo}|Phone=${requestData.Phone}|Email=${requestData.Email}|ProductInfo=${requestData.ProductInfo}|AmountPaid=${requestData.AmountPaid}`;

        const checksum = generateHash512(requestDataString);

        const formValue = `${requestDataString}|CheckSum=${checksum}|ReturnURL=http://localhost:58851/College/Purenewal.aspx`;

        const form = document.createElement('form');
        form.id = 'FormPost';
        form.method = 'post';
        form.action = 'https://koneportal.cmsuat.co.in:1443/SPORTI/Index/UXhBakNVanVwTFRWM3IremdWSjV5dz09';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.id = 'SPORTIFormData';
        input.name = 'SPORTIFormData';
        input.value = formValue;
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        axios.post('https://sporti-services-backend.onrender.com/api/sporti/service/book', formData)
            .then(response => {
                const { success, user } = response.data;
                if (success) {
                    setIsLoading(false);
                    // openDialog('Success', `Your booking request has been sent to admin for confirmation and it takes one  working day  for the same. SMS will be sent to the registered mobile number. please note the  acknowledgement number for future  reference.  ApplicationNo is ${user.applicationNo}`, false);
                   toast.success('successfully added')
                } else {
                    setIsLoading(false);
                    toast.error("error", 'something went wrong please try again later..')
                    // openDialog('Error', 'something went wrong please try again later..', true);
                }
            })
            .catch((error) => {
                setIsLoading(false);
                console.error('Error submitting form:', error);
            });
    };

    if (isLoading) {
        return <Loading />;
    }


    return (
        <div className='main-function-hall-booking container-fluid p-2'>
            <div className="">
                <div className=" m-auto bg-white p-0">
              
                   
                 
                  <div className="">
                  <form onSubmit={submitForm}>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label htmlFor="username" className="form-label">{selectedLanguage === 'kannada' ? 'ಬಳಕೆದಾರರ ಹೆಸರು' : 'Username'}</label>
                                    <input type="text" className="form-control" name="username" id="username" value={formData.username} onChange={handleFormChange} />
                                    {errors.username && <small className="text-danger">{errors.username}</small>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label htmlFor="officerDesignation" className="form-label">{selectedLanguage === 'kannada' ? 'ಹುದ್ದೆ' : 'Designation'}</label>
                                    <input type="text" className="form-control" name="officerDesignation" id="officerDesignation" value={formData.officerDesignation} onChange={handleFormChange} />
                                    {errors.officerDesignation && <small className="text-danger">{errors.officerDesignation}</small>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label htmlFor="email" className="form-label">{selectedLanguage === 'kannada' ? 'ಇಮೇಲ್' : 'Email'}</label>
                                    <input type="text" className="form-control" name="email" id="email" value={formData.email} onChange={handleFormChange} />
                                    {errors.email && <small className="text-danger">{errors.email}</small>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label htmlFor="phoneNumber" className="form-label">{selectedLanguage === 'kannada' ? 'ಫೋನ್ ನಂಬರ್' : 'Phone Number'}</label>
                                    <input type="text" className="form-control" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} />
                                    {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label htmlFor="checkIn" className="form-label">{selectedLanguage === 'kannada' ? 'ಚೆಕ್-ಇನ್' : 'Check-In'}</label>
                                    <input type="datetime-local" className="form-control" name="checkIn" id="checkIn" value={formData.checkIn} onChange={handleFormChange} />
                                    {errors.checkIn && <small className="text-danger">{errors.checkIn}</small>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label htmlFor="checkOut" className="form-label">{selectedLanguage === 'kannada' ? 'ಚೆಕ್-ಔಟ್' : 'Check-Out'}</label>
                                    <input type="datetime-local" className="form-control" name="checkOut" id="checkOut" value={formData.checkOut} onChange={handleFormChange} />
                                    {errors.checkOut && <small className="text-danger">{errors.checkOut}</small>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label htmlFor="officerCadre" className="form-label">{selectedLanguage === 'kannada' ? 'ಅಧಿಕಾರಿ ಕೇಡರ್' : 'Officer Cadre'}</label>
                                    <input type="text" className="form-control" name="officerCadre" id="officerCadre" value={formData.officerCadre} onChange={handleFormChange} />
                                    {errors.officerCadre && <small className="text-danger">{errors.officerCadre}</small>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label htmlFor="sporti" className="form-label">{selectedLanguage === 'kannada' ? 'SPORTI' : 'SPORTI'}</label>
                                    <Dropdown onSelect={(value) => handleDropdownChange('sporti', value)}>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-sporti">
                                            {formData.sporti || (selectedLanguage === 'kannada' ? 'SPORTI ಆಯ್ಕೆಮಾಡಿ' : 'Select SPORTI')}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="SPORTI-1">SPORTI-1</Dropdown.Item>
                                            <Dropdown.Item eventKey="SPORTI-2">SPORTI-2</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {errors.sporti && <small className="text-danger">{errors.sporti}</small>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label htmlFor="roomType" className="form-label">{selectedLanguage === 'kannada' ? 'ಕೊಠಡಿ ಪ್ರಕಾರ' : 'Room Type'}</label>
                                    <Dropdown onSelect={(value) => handleDropdownChange('roomType', value)}>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-roomType">
                                            {formData.roomType || (selectedLanguage === 'kannada' ? 'ಕೊಠಡಿ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ' : 'Select Room Type')}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {renderRoomTypes()}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {errors.roomType && <small className="text-danger">{errors.roomType}</small>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label htmlFor="guestType" className="form-label">{selectedLanguage === 'kannada' ? 'ಅತಿಥಿ ಪ್ರಕಾರ' : 'Guest Type'}</label>
                                    <Dropdown onSelect={(value) => handleDropdownChange('guestType', value)}>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-guestType">
                                            {formData.serviceType || (selectedLanguage === 'kannada' ? 'ಅತಿಥಿ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ' : 'Select Guest Type')}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="Officers from Karnataka">{selectedLanguage === 'kannada' ? 'ಕರ್ನಾಟಕದ ಅಧಿಕಾರಿಗಳು' : 'Officers from Karnataka'}</Dropdown.Item>
                                            <Dropdown.Item eventKey="Officers from Other States">{selectedLanguage === 'kannada' ? 'ಇತರೆ ರಾಜ್ಯಗಳ ಅಧಿಕಾರಿಗಳು' : 'Officers from Other States'}</Dropdown.Item>
                                            <Dropdown.Item eventKey="Serving and Senior Police Officers">{selectedLanguage === 'kannada' ? 'ಇತರೆ' : 'Serving and Senior Police Officers'}</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {errors.serviceType && <small className="text-danger">{errors.guestType}</small>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label htmlFor="noGuests" className="form-label">{selectedLanguage === 'kannada' ? 'ಅತಿಥಿಗಳ ಸಂಖ್ಯೆ' : 'Number of Guests'}</label>
                                    <input type="number" className="form-control" name="noGuests" id="noGuests" value={formData.noGuests} onChange={handleFormChange} min="1" />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mt-3">
                                    <label className="form-label">{selectedLanguage === 'kannada' ? 'ಒಟ್ಟು ವೆಚ್ಚ (₹)' : 'Total Cost (₹)'}</label>
                                    <input type="text" className="form-control" value={formData.totalCost} readOnly />
                                </div>
                            </div>
                            <div className="col-md-12 mt-4 p-3 d-flex justify-content-end gap-2">
                            <button type="submit" className="blue-btn rounded-1 m-1">{selectedLanguage === 'kannada' ? 'ಸಲ್ಲಿಸು' : 'Submit'}</button>
                            <button className="btn btn-danger rounded-1 m-1" type='reset'>Cancel</button>
                            </div>
                        </div>
                    </form>
                  </div>
                </div>
            </div>

            {showModal && <SuccessPopup showModal={showModal} handleClose={handleClose} title={title} desc={desc} />}
        </div>
    );
}

export default MainRoomBook;
