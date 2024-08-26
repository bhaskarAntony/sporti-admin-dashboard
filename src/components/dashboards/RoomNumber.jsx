import React, { useState, useEffect } from "react";
import { Dropdown, DropdownButton, ButtonGroup, Card, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../popup/Loading";
import axios from "axios";
import './style.css';

const RoomSelection = () => {
  const [selectedSporti, setSelectedSporti] = useState('SPORTI-2');
  const [selectedRoom, setSelectedRoom] = useState(null);
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
      if (!formData.roomType || !selectedSporti) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `https://sporti-backend-live-p00l.onrender.com/api/available/rooms?roomType=${formData.roomType}&sporti=${formData.sporti}`
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
  }, [formData.roomType, selectedSporti]);

  const handleSportiSelect = (sporti) => {
    setSelectedSporti(sporti);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* <div className="bg-dark p-3">
        <DropdownButton
          as={ButtonGroup}
          title={`Selected: ${selectedSporti}`}
          onSelect={handleSportiSelect}
          variant="light"
          className="rounded-1"
        >
          <Dropdown.Item eventKey="SPORTI-1">SPORTI-1</Dropdown.Item>
          <Dropdown.Item eventKey="SPORTI-2">SPORTI-2</Dropdown.Item>
        </DropdownButton>
      </div> */}

      <Container fluid className="bg-light p-3">
        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="p-3 bg-white shadow">
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
                                onClick={() => handleRoomSelect(room)}
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
              <div className="d-flex align-items-center justify-content-end">
                <button className="main-btn" onClick={handleConfirmBooking} disabled={!selectedRoom}>
                  Confirm Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RoomSelection;
