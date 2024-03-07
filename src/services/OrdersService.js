import axios from './BaseService';
import { REACT_APP_API_URL as API_URL } from '@env';
// console.log(API_URL, "API URL in order to");
const ORDERS_URL = `${API_URL}/orders`;
import { STOP_TYPES } from './ExchangeService';

export async function getOrders(symbol, page = 1, isFuture = false) {
    const response = await axios.get(`${ORDERS_URL}/${symbol}?page=${page}&isFuture=${isFuture}`);
    return response.data.rows;
}

export async function getOrder(orderId, clientOrderId) {
    const response = await axios.get(`${ORDERS_URL}/${orderId}/${clientOrderId}`);
    return response.data;
}

export async function syncOrder(beholderOrderId, isFuture = false) {
    const response = await axios.post(`${ORDERS_URL}/${beholderOrderId}/sync?isFuture=${isFuture}`, null);
    return response.data;
}

export async function cancelOrder(symbol, orderId, isFuture = false) {
    const response = await axios.delete(`${ORDERS_URL}/${symbol}/${orderId}?isFuture=${isFuture}`);
    return response.data;
}

export async function placeOrder(order, isFuture = false) {
    const postOrder = {
        symbol: order.symbol.toUpperCase(),
        quantity: order.quantity,
        side: order.side.split('/')[0].trim().toUpperCase(),
        options: {
            type: order.type.toUpperCase()
        }
    }

    if (isFuture && ['LIMIT', 'STOP', 'TAKE_PROFIT', 'TRAILING_STOP_MARKET'].includes(postOrder.options.type))
        postOrder.limitPrice = order.limitPrice;
    else if (!isFuture && ['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT', 'TRAILING_STOP'].includes(postOrder.options.type))
        postOrder.limitPrice = order.limitPrice;

    if (STOP_TYPES.includes(postOrder.options.type))
        postOrder.options.stopPrice = order.stopPrice;

    if (['TRAILING_STOP', 'TRAILING_STOP_MARKET'].includes(postOrder.options.type))
        postOrder.options.stopPriceMultiplier = order.stopPriceMultiplier;

    const response = await axios.post(`${ORDERS_URL}?isFuture=${isFuture}`, postOrder);
    return response.data;
}

export function thirtyDaysAgo() {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - 30);
    date.setUTCHours(0, 0, 0, 0);
    return date.getTime();
}

function getToday() {
    const date = new Date();
    date.setUTCHours(23, 59, 59, 999);
    return date.getTime();
}

function getStartDay() {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    return date.getTime();
}

export async function getOrdersReport(quote, startDate, endDate, isFuture = false) {
    startDate = startDate ? startDate : thirtyDaysAgo();
    endDate = endDate ? endDate : getToday();

    const response = await axios.get(`${ORDERS_URL}/reports/${quote}?startDate=${startDate}&endDate=${endDate}&isFuture=${isFuture}`);
    console.log(response, "Response");
    return response.data;
}

export async function getDayTradeReport(quote, date, isFuture = false) {
    date = date ? date : getStartDay();

    const response = await axios.get(`${ORDERS_URL}/reports/${quote}?date=${date}&isFuture=${isFuture}`);
    console.log(response, "response2");
    return response.data;
}