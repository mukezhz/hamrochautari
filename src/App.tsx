import 'livekit-react/dist/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PreJoinPage } from './views/PreJoinPage'
import { RoomPage } from './views/RoomPage'
import { Home } from './views/Home';
import { Login } from './views/Login';
import { PrivateRoute } from './views/PrivateRoute';
import { Chautari } from './views/Chautari';
import { CustomName } from "./views/CustomName";

const App = () => {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<PrivateRoute component={RoomPage} />} />
          <Route path="/test" element={<PrivateRoute component={PreJoinPage} />} />
          <Route path="/:roomname" element={<Chautari />} />
          <Route path="/login" element={<Login />} />
          <Route path="/name" element={<CustomName />} />
        </Routes>
      </Router>
    </div >
  )
}

export default App
