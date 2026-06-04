// src/ChatRoom.jsx

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ChatRoom() {
    const { roomName } = useParams(); // Extract room name from the URL
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const ws = useRef(null);

    useEffect(() => {
        // 1. Fetch previous message history via REST API
        axios.get(`http://localhost:8000/api/messages/${roomName}/`)
            .then(response => setMessages(response.data))
            .catch(error => console.error("Error fetching history:", error));

        // 2. Establish a WebSocket connection for real-time messaging
        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
        ws.current = socket;

        // 3. Listen for incoming messages from the WebSocket server
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Append the new message to the existing message list
            setMessages(prevMessages => [...prevMessages, data]);
        };

        // 4. Clean up the WebSocket connection when the component unmounts
        return () => {
            if (socket.readyState === 1) { 
                socket.close();
            } else {
                socket.onopen = () => socket.close();
            }
        };
    }, [roomName]);

    // Function to handle sending a new message
    const sendMessage = () => {
        if (inputMessage.trim() !== '') {
            // Send the message data as a JSON string through the WebSocket
            ws.current.send(JSON.stringify({
                message: inputMessage,
                sender: 'User1' // (Temporary static username until proper authentication is added)
            }));
            // Clear the input field after sending
            setInputMessage(''); 
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <h2>Room: {roomName}</h2>
            
            {/* Chat message display area */}
            <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px', marginBottom: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <strong>{msg.sender?.username || msg.sender}: </strong> 
                        <span>{msg.content || msg.message}</span>
                    </div>
                ))}
            </div>

            {/* Message input and send button area */}
            <input 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)} 
                placeholder="Type a message..."
                style={{ width: '75%', padding: '10px' }}
            />
            <button onClick={sendMessage} style={{ width: '20%', padding: '10px', marginLeft: '2%' }}>
                Send
            </button>
        </div>
    );
}

export default ChatRoom;