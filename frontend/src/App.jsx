import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomList from './RoomList';
import ChatRoom from './ChatRoom';

function App() {
    return (
        <Router>
            <Routes>
                {/* Route for the home page displaying the list of rooms */}
                <Route path="/" element={<RoomList />} />
                
                {/* Route for the individual chat room */}
                <Route path="/chat/:roomName" element={<ChatRoom />} />
            </Routes>
        </Router>
    );
}

export default App;