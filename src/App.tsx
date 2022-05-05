import 'livekit-react/dist/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PreJoinPage } from './views/PreJoinPage'
import { RoomPage } from './views/RoomPage'
import { Home } from './views/Home';
import { RoomCheck } from './views/RoomCheck';
import { RoomStart } from './views/RoomStart';
import { Login } from './views/Login';
import { PrivateRoute } from './views/PrivateRoute';

const App = () => {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<PrivateRoute component={RoomPage} />} />
          <Route path="/test" element={<PrivateRoute component={PreJoinPage} />} />
          <Route path="/:roomname" element={<PrivateRoute component={RoomCheck} />} />
          <Route path="/:roomname/start" element={<PrivateRoute component={RoomStart} />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div >
  )
}

export default App
