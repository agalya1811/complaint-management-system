import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientHome from './pages/client/Home';
import ClientLogin from './pages/client/ClientLogin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/client/home" element={<ClientHome />} />
        <Route path="/client/login" element={<ClientLogin />} />

        {/* Add support and technician pages here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
