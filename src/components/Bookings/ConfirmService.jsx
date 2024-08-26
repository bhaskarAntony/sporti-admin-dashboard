import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/image.png';
import './style.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../popup/Loading';

function ConfirmService() {
    const location = useLocation();
    const [isKannada, setIsKannada] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const [totalCost, setTotalCost] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
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
        }
    }, [location.state]);

    useEffect(() => {
        setTotalCost(calculateTotalServiceCost());
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
            case 'Instructions': return 'ನಿರ್ದೆಶಗಳು';
            case 'Your booking request is being processed by the administrator.': return 'ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ವಿನಂತಿಯನ್ನು ನಿರ್ಧಾರಕ್ಕಾಗಿ ನಿರ್ವಾಹಕನಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.';
            case 'You will receive an email and SMS confirmation regarding your booking.': return 'ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ಕುರಿತು ಇಮೇಲ್ ಮತ್ತು SMS ದೃಢೀಕರಣವನ್ನು ನೀವು ಪಡೆಯುತ್ತೀರಿ.';
            case 'It will take one working day to confirm your request.': return 'ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ದೃಢೀಕರಿಸಲು ಒಂದೇ ಕೆಲಸದ ದಿನವೇ ಬೇಕಾಗಿದೆ.';
            case 'Please note your Booking ID for future reference after booking.': return 'ಬುಕ್ಕಿಂಗ್ ನಂತರ ಭವಿಷ್ಯದಲ್ಲಿ ಉಲ್ಲೇಖಕ್ಕಾಗಿ ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ಐಡಿ ಗಮನದಲ್ಲಿರಲಿ.';
            default: return text;
        }
    };

    const calculateTotalServiceCost = () => {
        let baseCost = 0;
        switch (formData.serviceName) {
            case 'Main Function Hall':
                baseCost = formData.serviceType === 'Others' ? 45000 :
                           formData.serviceType === 'Officers from Other State' ? 25000 :
                           formData.serviceType === 'Officers from Karnataka State' ? 2000 : 0;
                break;
            case 'Conference Room':
                baseCost = formData.serviceType === 'Others' ? 15000 :
                           formData.serviceType === 'Officers from Other State' ? 10000 :
                           formData.serviceType === 'Officers from Karnataka State' ? 7500 : 0;
                break;
            case 'Barbeque Area':
                baseCost = formData.serviceType === 'Others' ? 10000 :
                           formData.serviceType === 'Officers from Other State' ? 7500 :
                           formData.serviceType === 'Officers from Karnataka State' ? 5000 : 0;
                break;
            default:
                baseCost = 0;
        }
        return baseCost * formData.numberOfDays;
    };

    const submitForm = (e) => {
        e.preventDefault();

        setIsLoading(true);
        axios.post('https://sporti-backend-live-p00l.onrender.com/api/sporti/service/service/book', formData)
            .then(response => {
                const { success, user } = response.data;
                if (success) {
                    setIsLoading(false);
                  toast.success(`Success`)
                  navigate('/');
                } else {
                    setIsLoading(false);
                   toast.error('Something went wrong, please try again later.')
                }
            })
            .catch((error) => {
                setIsLoading(false);
               toast.error('Booking Error')
            });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className='container-fluid bg-light p-2 confirm-service'>
            <div className="row">
                <div className="col-md-8 m-auto">
                    <div className="card p-3 p-md-5 border-0 w-100">
                        <div className="d-flex align-items-center gap-3">
                            <img src={logo} alt="sporti" />
                            <h1 className="fs-3">{selectedLanguage === 'english' ? 'Confirm your Booking' : 'ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ಅನ್ನು ದೃಢೀಕರಿಸಿ'}</h1>
                        </div>
                        <hr />
                        <h1 className="fs-5 text-success fw-bold">{selectedLanguage === 'english' ? 'Officers Information' : 'ಅಧಿಕಾರಿಗಳ ಮಾಹಿತಿ'}</h1>
                        <h1 className="fs-5 fw-bold">{formData.username}</h1>
                        <span className="fs-6 d-block mt-2">{selectedLanguage === 'english' ? 'Phone number:' : translateToKannada('Phone Number')} <span className="text-secondary">{formData.phoneNumber}</span></span>
                        <span className="fs-6 d-block mt-2">{selectedLanguage === 'english' ? 'Email Address:' : translateToKannada('Email')} <span className="text-secondary">{formData.email}</span></span>
                        {/* <span className="fs-6 d-block mt-2">{selectedLanguage === 'english' ? 'Cadre:' : translateToKannada('Cadre')} <span className="text-secondary">{formData.officerCadre}</span></span> */}
                        <span className="fs-6 d-block mt-2">{selectedLanguage === 'english' ? 'Designation:' : translateToKannada('Designation')} <span className="text-secondary">{formData.officerDesignation}</span></span>
                        <span className="fs-6 d-block mt-2"><b>{selectedLanguage === 'english' ? 'Event Start date:' : translateToKannada('Event start date')} <span className="text-secondary">{formData.eventdate}</span></b></span>
                      <div className="table-container">
                      <table className='mt-3' cellSpacing="0" cellPadding={15}>
                            <thead>
                                <tr className='bg-main text-light border'>
                                    <th>SI.No</th>
                                    <th>{selectedLanguage === 'english' ? 'Hall Type' : translateToKannada('Hall type')}</th>
                                    <th>{selectedLanguage === 'english' ? 'Officers Category' : translateToKannada('Officers Category')}</th>
                                    <th>{selectedLanguage === 'english' ? 'No.Days' : translateToKannada('No.Days')}</th>
                                    <th>{selectedLanguage === 'english' ? 'Per Day' : translateToKannada('Total Cost (₹)')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className='border'>
                                    <td>01</td>
                                    <td>{formData.serviceName}</td>
                                    <td>{formData.serviceType}</td>
                                    <td>{formData.numberOfDays} days</td>
                                    <td>&#8377;{totalCost / formData.numberOfDays}</td>
                                </tr>
                                <tr className='border'>
                                    <td colSpan={3}><big><b>{selectedLanguage === 'english' ? 'Total' : translateToKannada('Total')}</b></big></td>
                                    <td className='bg-main text-center' colSpan={2}><h3 className="fs-5 text-light">&#8377; {totalCost}</h3></td>
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

export default ConfirmService;