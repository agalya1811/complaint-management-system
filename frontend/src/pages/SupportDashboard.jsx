import React, { useEffect, useState } from 'react';

function SupportDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchComplaints();
    fetchTechnicians();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/complaints/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } 
  };

const fetchTechnicians = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/users?role=technician`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('Fetch technicians error response:', text);
      throw new Error(`Error fetching technicians: ${res.status}`);
    }
    const data = await res.json();
    setTechnicians(data);
  } catch (err) {
    console.error('Error fetching technicians:', err);
    setTechnicians([]); // clear or fallback
  }
};


  const assignToTechnician = async (complaintId) => {
    const technicianId = selectedTech[complaintId];
    if (!technicianId) {
      alert('Please select a technician first');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/complaints/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ complaintId, technicianId }),
      });

      if (res.ok) {
        alert('Complaint assigned successfully');
        fetchComplaints(); // Refresh complaint list
      } else {
        alert('Failed to assign complaint');
      }
    } catch (err) {
      console.error('Error assigning complaint:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Support Team Dashboard</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Assign Technician</th>
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
                    value={selectedTech[c._id] || ''}
                    onChange={(e) =>
                      setSelectedTech((prev) => ({
                        ...prev,
                        [c._id]: e.target.value,
                      }))
                    }
                  >
                    <option value="">-- Select --</option>
                    {technicians.map((tech) => (
                      <option key={tech._id} value={tech._id}>
                        {tech.username}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => assignToTechnician(c._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SupportDashboard;
