// src/contexts/BookingContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const BookingContext = createContext();

const BookingProvider = ({ children }) => {
  const [Contextbookings, setBookings] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Fetch booking data from API
  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://sporti-backend-live-p00l.onrender.com/api/sporti/service/bookings');
      setBookings((response.data).reverse());
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [location.pathname]);

  return (
    <BookingContext.Provider value={{ Contextbookings, isloading, error, fetchBookings }}>
      {children}
    </BookingContext.Provider>
  );
};

export { BookingContext, BookingProvider };
