import axios from './BaseService';
import { REACT_APP_API_URL as API_URL } from '@env';
const AUTOMATIONS_URL = `${API_URL}/automations`;

export async function getAutomations(page = 1) {
    const response = await axios.get(`${AUTOMATIONS_URL}/?page=${page}`);
    return response.data.rows;
}

export async function startAutomation(id) {
    const response = await axios.post(`${AUTOMATIONS_URL}/${id}/start`, {});
    return response.data;
}

export async function stopAutomation(id) {
    const response = await axios.post(`${AUTOMATIONS_URL}/${id}/stop`, {});
    return response.data;
}

export async function deleteAutomation(id) {
    const response = await axios.delete(`${AUTOMATIONS_URL}/${id}`);
    return response.data;
}

export async function saveAutomation(id, newAutomation) {
    let response;

    if (id)
        response = await axios.patch(`${AUTOMATIONS_URL}/${id}`, newAutomation);
    else
        response = await axios.post(`${AUTOMATIONS_URL}/`, newAutomation);
    return response.data;
}

export async function saveGrid(id, newAutomation, levels, quantity) {
    let response;

    if (id)
        response = await axios.patch(`${AUTOMATIONS_URL}/${id}?levels=${levels}&quantity=${quantity}`, newAutomation);
    else
        response = await axios.post(`${AUTOMATIONS_URL}/?levels=${levels}&quantity=${quantity}`, newAutomation);
    return response.data;
}
