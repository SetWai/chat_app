// src/RoomList.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function RoomList() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // Fetch the list of available chat rooms from the Django backend
        axios.get('http://localhost:8000/api/rooms/')
            .then(response => {
                setRooms(response.data);
            })
            .catch(error => console.error("Error fetching rooms:", error));
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Available Chat Rooms</h2>
            <ul>
                {rooms.map(room => (
                    <li key={room.id} style={{ margin: '10px 0' }}>
                        {/* Link to the specific chat room using its name */}
                        <Link to={`/chat/${room.name}`}>{room.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RoomList;