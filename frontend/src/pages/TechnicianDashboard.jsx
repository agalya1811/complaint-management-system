import React, { useEffect, useState } from 'react';

function TechnicianDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const fetchAssignedComplaints = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/complaints/assigned', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching assigned complaints:', err);
    }
  };

  const updateStatus = async (complaintId) => {
    const status = selectedStatus[complaintId];
    if (!status) return alert('Please select a status');

    try {
      const res = await fetch('http://localhost:5000/api/complaints/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ complaintId, status }),
      });

      if (res.ok) {
        alert('Status updated');
        fetchAssignedComplaints();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Technician Dashboard</h2>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Update Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2 border">{c.title}</td>
              <td className="p-2 border">{c.clientId?.username || 'N/A'}</td>
              <td className="p-2 border">{c.description}</td>
              <td className="p-2 border capitalize">{c.status}</td>
              <td className="p-2 border">
                <select
                  className="border px-2 py-1 rounded"
                  value={selectedStatus[c._id] || ''}
                  onChange={(e) =>
                    setSelectedStatus((prev) => ({
                      ...prev,
                      [c._id]: e.target.value,
                    }))
                  }
                >
                  <option value="">-- Select --</option>
                  <option value="received">Received</option>
                  <option value="closed">Closed</option>
                </select>
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => updateStatus(c._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
          {complaints.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No assigned complaints
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TechnicianDashboard;
