import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import Loading from '../popup/Loading';
import { toast } from 'react-toastify';
import { useAuth } from '../privateRoutes/AuthContext';
import DOMPurify from 'dompurify';

function sanitizeInput(input) {
    return DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });
} 
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth()

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
         // Client-side validation for max length and sanitization
            if (username.length > 30 || password.length > 30) {
                const message = 'Email or password is too long';
                const details =  'Please enter shorter email and password.';
                
                toast.error(
                DOMPurify.sanitize(message),
                DOMPurify.sanitize(details),
                true
                );
                return;
            }
        try {
            const res = await axios.post('http://localhost:5000/api/admin/login', { username, password });
            setLoading(false);
            toast.success('Login successful', { autoClose: 3000 })
            localStorage.setItem('token', res.data.token);
            login(res.data.token);
            navigate('/');
        } catch (error) {
            setLoading(false);
            toast.error('error', error)
            setError('Invalid username or password');
            console.error('Login error:', error);
        }
    };

    if(loading){
        return <Loading/>
    }
    return (
        <Container fluid className="vh-100">
            <Row>
                <Col md={6} lg={4} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Login</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Enter username"
                                        name="username"
                                        value={username} 
                                        onChange={(e) => setUsername(sanitizeInput(e.target.value.trim()))} 
                                        required 
                                        maxLength={30}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Password" 
                                        value={password} 
                                        onChange={(e) => setPassword(sanitizeInput(e.target.value.trim().toLowerCase()))} 
                                        required 
                                        maxLength={30}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Login
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
