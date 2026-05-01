import axios from 'axios';
import { baseURLRealDevice } from '../assets/constants/baseurl';

const api = axios.create({
  baseURL: baseURLRealDevice, // baseurltest is local host http://10.0.2.2:8000
  timeout: 15000,
});

export default api;
