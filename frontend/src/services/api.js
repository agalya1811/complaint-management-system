import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const loginUser = (data) => API.post('/users/login', data);
export const createComplaint = (data) => API.post('/complaints/create', data);
export const getComplaints = () => API.get('/complaints');
export const assignComplaint = (data) => API.put('/complaints/assign', data);
export const markReceived = (data) => API.put('/complaints/received', data);
