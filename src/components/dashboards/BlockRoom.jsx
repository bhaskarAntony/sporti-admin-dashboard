import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../popup/Loading";
import axios from "axios";
import './style.css';

const BlockRoom = () => {
  const [selectedSporti, setSelectedSporti] = useState('SPORTI-2');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState('VIP');
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState({});
  const [formData, setFormData] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (location.state && location.state.data) {
      setFormData(location.state.data);
    }
  }, [location]);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!selectedRoomType || !selectedSporti) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `https://sporti-backend-live-p00l.onrender.com/api/available/rooms?roomType=${selectedRoomType}&sporti=${selectedSporti}`
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
  }, [selectedRoomType, selectedSporti]);

  const handleSportiSelect = (event) => {
    setSelectedSporti(event.target.value);
    setSelectedRoom(null);
  };

  const handleRoomTypeSelect = (event) => {
    setSelectedRoomType(event.target.value);
    setSelectedRoom(null);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleConfirmBooking = async () => {
    if (!selectedRoom) return;

    setLoading(true);
    try {
      await axios.patch(`https://sporti-backend-live-p00l.onrender.com/api/sporti/service/${formData._id}/select-room/${selectedRoom.id}`, {
        roomNumber: selectedRoom.roomNumber,
      });
      setLoading(false);
      toast.success('Room confirmed successfully');
      navigate('/');
    } catch (error) {
      setLoading(false);
      toast.error('Failed to confirm room');
      console.error('Error:', error);
    }
  };

  const blockRoom = async (id) => {
  if(window.confirm('DO You want to Block the room')){
    setLoading(true);
    try {
      await axios.post(`https://sporti-backend-live-p00l.onrender.com/api/block/room/${id}`);
      toast.success('Blocked successfully');

      // Fetch updated room data after blocking a room
      const response = await axios.get(
        `https://sporti-backend-live-p00l.onrender.com/api/available/rooms?roomType=${selectedRoomType}&sporti=${selectedSporti}`
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
      toast.error(error.message);
      setLoading(false);
    }
  }else{
    toast.warning('Room Blocking is cancelled')
  }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Container fluid>
        <div className="d-flex gap-3">
          <select 
            name="sporti" 
            className="form-control" 
            value={selectedSporti} 
            onChange={handleSportiSelect}
          >
            <option disabled>Select the SPORTI</option>
            <option value="SPORTI-1">SPORTI-1</option>
            <option value="SPORTI-2">SPORTI-2</option>
          </select>

          <select 
            name="roomType" 
            className="form-control" 
            value={selectedRoomType} 
            onChange={handleRoomTypeSelect}
          >
            <option disabled>Select the Room Type</option>
            <option value="Standard">Standard</option>
            <option value="VIP">VIP</option>
            <option value="Family">Family</option>
          </select>
        </div>

        <div className="row">
          <div className="col-md-12 m-auto">
            <div className="">
              {Object.keys(roomData).map((floor) => (
                <div key={floor}>
                  <h4>{`Floor ${floor}`}</h4>
                  <hr />
                  <Row>
                    {Object.keys(roomData[floor]).map((category) => (
                      <Col key={category} xs={12} md={12} lg={12}>
                        <Card className="mb-3">
                          <Card.Header
                            style={{
                              backgroundColor: category === "VIP" ? "gold" : category === "FAMILY ROOM" ? "lightblue" : "lightgreen"
                            }}
                          >
                            {category}
                          </Card.Header>
                          <Card.Body>
                            {roomData[floor][category].map((room) => (
                              <button
                                key={room.id}
                                className={`m-1 ${selectedRoom && selectedRoom.id === room.id ? "room active" : "room"}`}
                                onClick={() => blockRoom(room.id)}
                                disabled={room.isBooked && !(selectedRoom && selectedRoom.id === room.id)}
                                style={{
                                  backgroundColor: selectedRoom && selectedRoom.id === room.id ? "#007bff" : "",
                                  borderColor: selectedRoom && selectedRoom.id === room.id ? "#007bff" : "",
                                  color: selectedRoom && selectedRoom.id === room.id ? "#fff" : "",
                                }}
                              >
                                {room.roomNumber}
                              </button>
                            ))}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
              
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BlockRoom;
