import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { loginUser } from '../../services/api';

export default function ClientLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ username, password });

      const user = res.data.user;

      // ✅ Set user in Zustand store
      setUser(user);

      // ✅ Save token and role in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', user.role);

      // ✅ Redirect based on role
      if (user.role === 'client') {
        navigate('/client/home');
      } else if (user.role === 'support') {
        navigate('/support-dashboard');
      } else if (user.role === 'technician') {
        navigate('/technician-dashboard');
      } else {
        alert('Unknown role');
      }
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl mb-4 font-bold text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}
