import axios from './BaseService';
import { REACT_APP_API_URL as API_URL } from '@env';
const MONITORS_URL = `${API_URL}/monitors`;

export async function getMonitorsBySymbol(symbol) {
    const response = await axios.get(`${MONITORS_URL}/?symbol=${symbol}`);
    return response.data;
}

export async function getMonitors(page = 1) {
    const response = await axios.get(`${MONITORS_URL}/?page=${page}`);
    return response.data.rows;
}

export async function startMonitor(id) {
    const response = await axios.post(`${MONITORS_URL}/${id}/start`, {});
    return response.data;
}

export async function stopMonitor(id) {
    const response = await axios.post(`${MONITORS_URL}/${id}/stop`, {});
    return response.data;
}

export async function deleteMonitor(id) {
    const response = await axios.delete(`${MONITORS_URL}/${id}`);
    return response.data;
}

export async function saveMonitor(id, newMonitor) {
    let response;

    if (id)
        response = await axios.patch(`${MONITORS_URL}/${id}`, newMonitor);
    else
        response = await axios.post(`${MONITORS_URL}/`, newMonitor);
    return response.data;
}
