import './App.css';
import Home from './Home'
import Tasks from './Tasks'
import Organisation from './Organisation'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Tasks />} />
          <Route path="/org" element={<Organisation />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
