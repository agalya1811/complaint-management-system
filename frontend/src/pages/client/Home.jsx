import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import ClientComplaintForm from './ClientComplaintForm';
import axios from 'axios';

export default function ClientLandingPage() {
  const user = useStore((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [messages, setMessages] = useState([]);

  const fetchComplaintMessages = async () => {
    if (!user?.id) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/complaints/client/${user.id}`);
      const data = res.data;

      const statusMessages = data.map((c) => {
        switch (c.status) {
          case 'received':
            return `Complaint "${c.title}" was received by the support team.`;
          case 'assigned':
            return `Complaint "${c.title}" was assigned to technician.`;
          case 'in-progress':
            return `Technician has received complaint "${c.title}".`;
          case 'closed':
            return `Complaint "${c.title}" has been resolved and closed.`;
          default:
            return `Complaint "${c.title}" submitted.`;
        }
      });

      setMessages(statusMessages);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  useEffect(() => {
    fetchComplaintMessages();
  }, [user]);

  if (!user) {
    return <div className="p-6 text-red-600 font-semibold">User not logged in</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.username || 'Client'}</h2>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">Client Details</h3>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
        <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Submit New Complaint
      </button>

      {showForm && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-start pt-12 z-50">
          <div className="bg-white p-6 rounded shadow-lg relative w-full max-w-lg border border-gray-300">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>
            <ClientComplaintForm
              onSuccess={() => {
                setShowForm(false);
                fetchComplaintMessages();
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Complaint Status Messages</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {messages.length > 0 ? (
            messages.map((msg, idx) => <li key={idx}>{msg}</li>)
          ) : (
            <li>No complaints submitted yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
