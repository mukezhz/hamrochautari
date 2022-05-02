import 'livekit-react/dist/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PreJoinPage } from './PreJoinPage'
import { RoomPage } from './RoomPage'
import { Hello } from './Home';
import { RoomCheck } from './RoomCheck';
import { RoomStart } from './RoomStart';

const App = () => {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
          <Route path="/room" element={<RoomPage />} />
          <Route path="/test" element={<PreJoinPage />} />
          <Route path="/:roomname" element={<RoomCheck />} />
          <Route path="/:roomname/start" element={<RoomStart />} />
        </Routes>
      </Router>
    </div >
  )
}

export default App
