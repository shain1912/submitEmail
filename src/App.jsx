import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLookup from './pages/StudentLookup';
import VerifyOTP from './pages/VerifyOTP';
import StatusBoard from './pages/StatusBoard';
import AdminPage from './pages/AdminPage';
import minecraftLogo from './assets/minecraft-logo.png';

function App() {
  return (
    <Router>
      <div className="clouds-container">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>
      <div className="app-container">
        <header className="app-header">
          <img src={minecraftLogo} alt="Minecraft Account Application" className="app-logo" />
        </header>
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

