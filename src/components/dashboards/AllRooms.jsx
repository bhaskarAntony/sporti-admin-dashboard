import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './style.css'

function AllRooms({roomType, sporti}) {
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState({});
  const [formData, setFormData] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedSporti, setSelectedSporti] = useState(sporti)
    useEffect(() => {
        const fetchRoomData = async () => {
        //   if (roomType || !sporti) return;
    
          setLoading(true);
          try {
            const response = await axios.get(
              `https://sporti-backend-live-p00l.onrender.com/api/available/rooms?roomType=${roomType}&sporti=${sporti}`
            );
            const rooms = response.data;
    
            const structuredData = rooms.reduce((acc, room) => {
              const { _id, floor, category, roomNumber, isBooked } = room;
              if (!acc[floor]) acc[floor] = {};
              if (!acc[floor][category]) acc[floor][category] = [];
    
              acc[floor][category].push({
                id: _id,
                roomNumber,
                isBooked,
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
  return (
    <div className='all-rooms'>
        <Container fluid className="bg-white p-3">
        {Object.keys(roomData).map((floor) => (
                <div key={floor}>
                  <h6>{`${floor}`}</h6>
                  <hr />
                  <Row>
                    {Object.keys(roomData[floor]).map((category) => (
                      <Col key={category} xs={12} md={12} lg={12}>
                        <div className="mb-3">
                        <button className={`btn-sm p-1 py-0 rounded-pill px-4 btn btn-${category === "VIP" ? "primary" : category === "FAMILY ROOM" ? "success" : "dark"}`}>
                            {category}
                        </button>
                          <div className='p-3 d-flex'>
                            {roomData[floor][category].map((room) => (

                              <button
                                key={room.id}
                                className={`m-1 ${room.isBooked ? "booked room active" : "available room"}`}
                                // onClick={() => handleRoomSelect(room)}
                               
                                style={{
                                  backgroundColor: selectedRoom && selectedRoom.id === room.id ? "#007bff" : "",
                                  borderColor: selectedRoom && selectedRoom.id === room.id ? "#007bff" : "",
                                  color: selectedRoom && selectedRoom.id === room.id ? "#fff" : "",
                                }}
                              >
                                {room.roomNumber}
                              </button>
                            ))}
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
      </Container>
    </div>
  )
}

export default AllRooms