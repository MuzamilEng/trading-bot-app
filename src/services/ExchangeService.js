import axios from './BaseService';
import { REACT_APP_API_URL as API_URL } from '@env';
const EXCHANGE_URL = `${API_URL}/exchange`;

export const STOP_TYPES = ["STOP", "TAKE_PROFIT", "STOP_MARKET", "TAKE_PROFIT_MARKET", "STOP_LOSS", "STOP_LOSS_LIMIT", "TAKE_PROFIT_LIMIT"]

export async function getFullBalance(fiat, isFuture = false) {
    const response = await axios.get(`${EXCHANGE_URL}/balance/full/${fiat}?isFuture=${isFuture}`);
    return response.data;
}

export async function getFuturesPositions(symbol = "") {
    const response = await axios.get(`${EXCHANGE_URL}/futures/${symbol}`);
    return response.data;
}

export async function updateFuturesPosition(symbol, params) {
    const response = await axios.patch(`${EXCHANGE_URL}/futures/${symbol}`, params);
    return response.data;
}

export async function closeFuturesPosition(symbol) {
    const response = await axios.delete(`${EXCHANGE_URL}/futures/${symbol}`);
    return response.data;
}

export async function closeAllFuturesPositions() {
    const response = await axios.delete(`${EXCHANGE_URL}/futures/all`);
    return response.data;
}