import axios from './BaseService';
import { REACT_APP_API_URL as API_URL } from '@env';
const BEHOLDER_URL = 'http://192.168.18.205:3002/beholder' || `${API_URL}/beholder`;
console.log(BEHOLDER_URL, "beholder");

export async function getMemoryIndex(symbol, index, interval = '') {
    const response = await axios.get(`${BEHOLDER_URL}/memory/${symbol}/${index}/${interval}`);
    return response.data;
}

export async function getIndexes() {
    const response = await axios.get(`${BEHOLDER_URL}/memory/indexes`);
    return response.data;
}

export async function getAnalysisIndexes() {
    const response = await axios.get(`${BEHOLDER_URL}/analysis`);
    return response.data;
}
