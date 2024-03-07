import axios from './BaseService';
// import { REACT_APP_API_URL as API_URL } from '@env';
const API_URL = 'http://192.168.18.205:3002' || process.env.REACT_APP_API_URL // for mobile devices
// const apiUrl = 'http://localhost:3002' || process.env.REACT_APP_API_URL  // for desktop devices
const SETTINGS_URL = `${API_URL}/settings`;

export async function getUserAlerts() {
    const response = await axios.get(`${SETTINGS_URL}/alerts`);
    return response ? response.data : null;
}

export async function getSettings() {
    const response = await axios.get(SETTINGS_URL);
    return response.data;
}

export async function updateSettings(settings) {
    const response = await axios.patch(SETTINGS_URL, settings);
    return response.data;
}