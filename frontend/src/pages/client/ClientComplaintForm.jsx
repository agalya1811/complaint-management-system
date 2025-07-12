import React, { useState } from 'react';
import useStore from '../../store/useStore';
import axios from 'axios';

export default function ClientComplaintForm({ onSuccess }) {
  const user = useStore((state) => state.user);

  const [form, setForm] = useState({
    title: '',
    description: '',
    buildingUnit: '',
    contractNumber: '',
    startDate: '',
    endDate: '',
    category: '',
    subCategory: '',
    image: null,
  });

  const categoryOptions = {
    electrical: ['Bulb', 'Light', 'Fan'],
    plumbing: ['Tap', 'Pipe', 'Shower'],
    mep: ['HVAC', 'Ducting'],
    'fire fighting': ['Sprinkler', 'Alarm'],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });
      data.append('clientId', user.id);

      await axios.post('http://localhost:5000/api/complaints/create', data);
      alert('Complaint submitted successfully');
      if (onSuccess) onSuccess(); // trigger parent to close form or refresh
    } catch (err) {
      console.error(err);
      alert('Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-xl font-semibold mb-2">Submit Complaint</h2>

      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="buildingUnit"
        placeholder="Building Unit"
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="contractNumber"
        placeholder="Contract Number"
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="date"
        name="startDate"
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="date"
        name="endDate"
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <select
        name="category"
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Category</option>
        {Object.keys(categoryOptions).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {form.category && (
        <select
          name="subCategory"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Subcategory</option>
          {categoryOptions[form.category]?.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full"
      />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Submit
      </button>
    </form>
  );
}
