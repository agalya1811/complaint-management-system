import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientHome from './pages/client/Home';
import ClientLogin from './pages/client/ClientLogin'
import SupportDashboard from './pages/SupportDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/client/home" element={<ClientHome />} />
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/support-dashboard" element={<SupportDashboard />} />
         <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
