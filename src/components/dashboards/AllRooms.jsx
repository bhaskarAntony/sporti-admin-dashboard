import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './style.css';

function AllRooms({ roomType, sporti }) {
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState({});

  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://sporti-backend-live-p00l.onrender.com/api/all/rooms');
        const rooms = response.data.data;

        const structuredData = rooms.reduce((acc, room) => {
          const { floor, category, roomNumber, isBooked } = room;
          if (!acc[floor]) acc[floor] = {};
          if (!acc[floor][category]) acc[floor][category] = [];

          acc[floor][category].push({
            ...room, // Include all room properties for easier access
          });

          return acc;
        }, {});

        setRoomData(structuredData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error('Failed to fetch room data.');
        console.error('Error:', error);
      }
    };

    fetchRoomData();
  }, [roomType, sporti]);

  const clearRoom = async (id) => {
    try {
      const res = await axios.post(`https://sporti-backend-live-p00l.onrender.com/api/clear/room/${id}`);
      toast.success('Room cleared successfully');
      console.log(id);
      
      console.log(res);
      
      // Optionally, refresh the room data after clearing
      // fetchRoomData();
    } catch (error) {
      toast.error('Failed to clear room. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <div className='all-rooms'>
      <Container fluid className="bg-white p-3">
        {loading ? (
          <p>Loading...</p>
        ) : (
          Object.keys(roomData).map((floor) => (
            <div key={floor}>
              <h5 className="mt-4">{`${floor}`}</h5>
              <hr />
              {Object.keys(roomData[floor]).map((category) => (
                <div key={category} className="mb-4">
                  <h6>{category}</h6>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Room Number</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomData[floor][category].map((room, index) => (
                        <tr key={index}>
                          <td>{room.roomNumber}</td>
                          <td>
                            <button
                              onClick={room.isBooked?(() => clearRoom(room._id)):(null)} // Pass the function reference correctly
                              className={`badge btn ${
                                room.isBooked ? 'btn-danger' : 'btn-success'
                              }`}
                              style={{ cursor: 'pointer' }} // Make it clear that the badge is clickable
                            >
                              {room.isBooked ? 'Clear This Room' : 'Available'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ))}
            </div>
          ))
        )}
      </Container>
    </div>
  );
}

export default AllRooms;
