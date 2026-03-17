import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLookup from './pages/StudentLookup';
import VerifyOTP from './pages/VerifyOTP';
import StatusBoard from './pages/StatusBoard';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<StudentLookup />} />
            <Route path="/verify" element={<VerifyOTP />} />
            <Route path="/status" element={<StatusBoard />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
