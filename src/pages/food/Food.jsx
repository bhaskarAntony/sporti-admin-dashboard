import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Food() {
    const [pendingOrders, setPendingOrders] = useState([]);

    useEffect(() => {
        axios.get('/admin/orders/pending')
            .then(response => {
                setPendingOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching pending orders:', error);
            });
    }, []);

    const acceptOrder = async (orderId) => {
        try {
            await axios.patch(`/admin/orders/${orderId}/accept`);
            // Refresh pending orders after accepting
            const response = await axios.get('/admin/orders/pending');
            setPendingOrders(response.data);
        } catch (error) {
            console.error('Error accepting order:', error);
        }
    };

    return (
        <div>
            <h1>Pending Orders</h1>
            <ul>
                {pendingOrders.map(order => (
                    <li key={order._id}>
                        <div>Order ID: {order._id}</div>
                        <div>Status: {order.status}</div>
                        <button onClick={() => acceptOrder(order._id)}>Accept Order</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Food;
