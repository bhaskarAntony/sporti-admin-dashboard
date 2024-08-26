import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/image.png';
import './style.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../popup/Loading';

function ConfirmRoom() {
    const location = useLocation();
    const [isKannada, setIsKannada] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const [totalCost, setTotalCost] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [numberOfDays, setNumberOfDays] = useState(0);
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
        applicationNo: '',
        eventdate: '',
        sporti: 'sporti',
        numberOfDays: 0
    });

    useEffect(() => {
        if (location.state && location.state.data) {
            setFormData({ ...formData, ...location.state.data });
            console.log(location.state.data);
        }
    }, [location.state]);

    useEffect(() => {
        setTotalCost(calculateTotalRoomCost());
    }, [formData]);

    useEffect(() => {
        setSelectedLanguage(isKannada ? 'kannada' : 'english');
    }, [isKannada]);

   

  
    const translateToKannada = (text) => {
        switch (text) {
            case 'Officer\'s Name': return 'ಅಧಿಕಾರಿಗಳ ಹೆಸರು';
            case 'Designation': return 'ಹುದ್ದೆ';
            case 'Cadre': return 'ಶ್ರೇಣಿ';
            case 'Email': return 'ಇಮೇಲ್';
            case 'Phone Number': return 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ';
            case 'Event start date': return 'ಈವೆಂಟ್ ಪ್ರಾರಂಭ ದಿನಾಂಕ';
            case 'Event end date': return 'ಈವೆಂಟ್ ಕೊನೆ ದಿನಾಂಕ';
            case 'Officers Category': return 'ಅಧಿಕಾರಿಗಳ ವರ್ಗ';
            case 'Hall type': return 'ಹಾಲ್ ಪ್ರಕಾರ';
            case 'Approximate No of guests': return 'ಅಂದಾಜು ಅತಿಥಿಗಳ ಸಂಖ್ಯೆ';
            case 'Total Cost (₹)': return 'ಒಟ್ಟು ವೆಚ್ಚ (₹)';
            case 'Submit': return 'ಸಲ್ಲಿಸಿ';
            case 'Cancel': return 'ರದ್ದುಮಾಡಿ';
            case 'Confirm your Booking': return 'ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ದೃಢೀಕರಿಸಿ';
            case 'Booking request has been sent to the administrator. You will receive an email and SMS. It takes one working day for confirmation SMS. Please note your Booking ID No': return 'ಬುಕ್ಕಿಂಗ್ ವಿನಂತಿ ನಿರ್ವಹಕನಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ನೀವು ಇಮೇಲ್ ಮತ್ತು ಎಸ್‌ಎಂಎಸ್ ಅನ್ನು ಪಡೆಯುತ್ತೀರಿ. ದೃಢೀಕರಣ ಎಸ್‌ಎಂಎಸ್‌ಗಾಗಿ ಒಬ್ಬ ಕೆಲಸದ ದಿನ ಬೇಕಾಗುತ್ತದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ಐಡಿ ಸಂಖ್ಯೆ ಅನ್ನು ಗಮನದಲ್ಲಿಟ್ಟುಕೊಳ್ಳಿ';
            case 'Booking failed, please try again.': return 'ಬುಕ್ಕಿಂಗ್ ವಿಫಲವಾಗಿದೆ, ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.';
            case 'Your booking request has been sent to the administrator. You will receive an email and SMS. It takes one working day for confirmation SMS. Please note your Booking ID No': return 'ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ವಿನಂತಿಯನ್ನು ನಿರ್ವಹಕನಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ನೀವು ಇಮೇಲ್ ಮತ್ತು ಎಸ್‌ಎಂಎಸ್ ಅನ್ನು ಪಡೆಯುತ್ತೀರಿ. ದೃಢೀಕರಣ ಎಸ್‌ಎಂಎಸ್‌ಗಾಗಿ ಒಬ್ಬ ಕೆಲಸದ ದಿನ ಬೇಕಾಗುತ್ತದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ಐಡಿ ಸಂಖ್ಯೆ ಅನ್ನು ಗಮನದಲ್ಲಿಟ್ಟುಕೊಳ್ಳಿ';
            case 'Instructions': return 'ಸೂಚನೆಗಳು';
            case 'Your booking request is being processed by the administrator.': return 'ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ವಿನಂತಿಯನ್ನು ನಿರ್ವಹಕನ ಮೂಲಕ ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ.';
            case 'You will receive an email and SMS confirmation regarding your booking.': return 'ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ಸಂಬಂಧಿಸಿದ ಇಮೇಲ್ ಮತ್ತು ಎಸ್‌ಎಂಎಸ್ ದೃಢೀಕರಣವನ್ನು ನೀವು ಪಡೆಯುತ್ತೀರಿ.';
            case 'It will take one working day to confirm your request.': return 'ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ದೃಢೀಕರಿಸಲು ಒಂದು ಕೆಲಸದ ದಿನ ಬೇಕಾಗುತ್ತದೆ.';
            case 'Please note your Booking ID for future reference after booking.': return 'ಬುಕ್ಕಿಂಗ್ ನಂತರ ಭವಿಷ್ಯಕ್ಕಾಗಿ ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ಐಡಿಯನ್ನು ಗಮನದಲ್ಲಿಟ್ಟುಕೊಳ್ಳಿ.';
            default: return text;
        }
    };

   
    const calculateTotalRoomCost = () => {
        let roomPrice = 0;
        switch (formData.roomType) {
            case 'Family':
                roomPrice = formData.serviceType === 'Officers from Karnataka State' ? 1600 :
                            formData.serviceType === 'Officers from Other State' ? 2100 :
                            formData.serviceType === 'Others' ? 1600 : 0;
                break;
            case 'VIP':
                roomPrice = formData.serviceType === 'Officers from Karnataka State' ? 1300 :
                            formData.serviceType === 'Officers from Other State' ? 1600 :
                            formData.serviceType === 'Others' ? 2700 : 0;
                break;
            case 'Standard':
                roomPrice = formData.serviceType === 'Officers from Karnataka State' ? 800 :
                            formData.serviceType === 'Officers from Other State' ? 1100 :
                            formData.serviceType === 'Others' ? 1600 : 0;
                break;
            default:
                roomPrice = 0;
        }
    
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        const diffTime = Math.abs(checkOutDate - checkInDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNumberOfDays(diffDays)
    
        return roomPrice * formData.noGuests * diffDays;
    };

    const submitForm = (e) => {
        e.preventDefault();
      
        setIsLoading(true);//https://sporti-backend-live-2.onrender.com
        axios.post('https://sporti-backend-live-p00l.onrender.com/api/sporti/service/room/book', formData)
            .then(response => {
                const { success, applicationNo } = response.data;
                if (success) {
                    setIsLoading(false);
                   toast.success(`Success`)
                    console.log(response);
                    localStorage.removeItem('roombooking')
                    navigate('/');
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

    if (isLoading) {
        return <Loading />;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };
    


     

    return (
        <div className='container-fluid bg-light p-2 confirm-service'>
            <div className="row">
                <div className="col-md-8 m-auto">
                    <div className="card p-3 p-md-5 border-0 w-100">
                        <div className="d-flex align-items-center gap-3">
                            <img src={logo} alt="sporti" />
                            <h1 className="fs-3">{selectedLanguage === 'english' ? 'Confirm your Booking' : translateToKannada('Confirm your Booking')}</h1>
                        </div>
                        <hr />
                        <h1 className="fs-5 text-success fw-bold">{selectedLanguage === 'english' ? 'Officers Information' : translateToKannada('Officer\'s Name')}</h1>
                        <h1 className="fs-5 fw-bold">{formData.username}</h1>
                        <span className="fs-6 d-block mt-2">{selectedLanguage === 'english' ? 'Phone number:' : translateToKannada('Phone Number')}{' '}<span className="text-secondary">{formData.phoneNumber}</span></span>
                        <span className="fs-6 d-block mt-2">{selectedLanguage === 'english' ? 'Email Address:' : translateToKannada('Email')}{' '}<span className="text-secondary">{formData.email}</span></span>
                        {/* <span className="fs-6 d-block mt-2">{selectedLanguage === 'english' ? 'Cadre:' : translateToKannada('Cadre')}{' '}<span className="text-secondary">{formData.officerCadre}</span></span> */}
                        <span className="fs-6 d-block mt-2">{selectedLanguage === 'english' ? 'Designation:' : translateToKannada('Designation')}{' '}<span className="text-secondary">{formData.officerDesignation}</span></span>
                        <span className="fs-6 d-block mt-2"><b>{selectedLanguage === 'english' ? 'Check in:' : translateToKannada('Event start date')}<span className="text-secondary"> {formatDate(formData.checkIn)}</span></b></span>
                        <span className="fs-6 d-block mt-2"><b>{selectedLanguage === 'english' ? 'Check out:' : translateToKannada('Event start date')}<span className="text-secondary"> {formatDate(formData.checkOut)}</span></b></span>
                        <div className="table-container">
                            <table className='mt-3' cellSpacing="0" cellPadding={15}>
                                <thead>
                                    <tr className='bg-main text-light border'>
                                        <th>SI.No</th>
                                        <th>{selectedLanguage === 'english' ? 'Room Type' : translateToKannada('Hall type')}</th>
                                        <th>{selectedLanguage === 'english' ? 'Officers Category' : translateToKannada('Officers Category')}</th>
                                        <th>{selectedLanguage === 'english' ? 'No.Guests' : translateToKannada('Approximate No of guests')}</th>
                                        <th>{selectedLanguage === 'english' ? 'No.Days' : translateToKannada('Event end date')}</th>
                                        <th>{selectedLanguage === 'english' ? 'Per guest' : translateToKannada('Total Cost (₹)')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='border'>
                                        <td>01</td>
                                        <td>{formData.roomType}</td>
                                        <td>{formData.guestType}</td>
                                        <td>{formData.noGuests} guests</td>
                                        <td>{numberOfDays} days</td>
                                        <td>&#8377;{totalCost / numberOfDays / formData.noGuests}/-</td>
                                    </tr>
                                    <tr className='border'>
                                        <td colSpan={4}><big><b>{selectedLanguage === 'english' ? 'Total' : translateToKannada('Total')}</b></big></td>
                                        <td className='bg-main text-center' colSpan={2}><h3 className="fs-5 text-light">&#8377; {totalCost}/-</h3></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <h1 className="mt-5 fs-5 text-danger">{selectedLanguage === 'english' ? 'Instructions' : translateToKannada('Instructions')}</h1>
                        <ul className="p-0" type="none">
                            <li className="fs-6 mb-2">{selectedLanguage === 'english' ? 'Your booking request is being processed by the administrator.' : translateToKannada('Your booking request is being processed by the administrator.')}</li>
                            <li className="fs-6 mb-2">{selectedLanguage === 'english' ? 'You will receive an email and SMS confirmation regarding your booking.' : translateToKannada('You will receive an email and SMS confirmation regarding your booking.')}</li>
                            <li className="fs-6 mb-2">{selectedLanguage === 'english' ? 'It will take one working day to confirm your request.' : translateToKannada('It will take one working day to confirm your request.')}</li>
                            <li className="fs-6 mb-2">{selectedLanguage === 'english' ? 'Please note your Booking ID for future reference after booking.' : translateToKannada('Please note your Booking ID for future reference after booking.')}</li>
                        </ul>
                        <div className="col-md-12 text-center mt-4 d-flex gap-3 justify-content-end">
                            <button type="button" className="main-btn rounded-1 m-0" onClick={submitForm}>
                                {selectedLanguage === 'english' ? 'Submit' : translateToKannada('Submit')}
                            </button>
                            <button type="button" className="btn btn-danger rounded-1 ms-2">
                                {selectedLanguage === 'english' ? 'Cancel' : translateToKannada('Cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmRoom;