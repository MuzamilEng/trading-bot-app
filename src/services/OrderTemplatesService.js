import axios from './BaseService';
import { REACT_APP_API_URL as API_URL } from '@env';
const ORDER_TEMPLATES_URL = `${API_URL}/ordertemplates`;

export async function getAllOrderTemplates(symbol) {
    const response = await axios.get(`${ORDER_TEMPLATES_URL}/all/${symbol}`);
    return response.data;
}

export async function deleteOrderTemplate(id) {
    const response = await axios.delete(`${ORDER_TEMPLATES_URL}/${id}`);
    return response.data;
}

export async function getOrderTemplates(symbol = '', page = 1, isFuture = false) {
    const orderTemplatesUrl = `${ORDER_TEMPLATES_URL}/${symbol || ''}?page=${page}&isFuture=${isFuture}`;
    const response = await axios.get(orderTemplatesUrl);
    return response.data;//{count, rows}
}

export async function getOrderTemplate(id) {
    const orderTemplatesUrl = `${ORDER_TEMPLATES_URL}/one/${id}`;
    const response = await axios.get(orderTemplatesUrl);
    return response.data;
}

export async function saveOrderTemplate(id, newOrderTemplate) {
    const regex = /^(\d+([,.]\d+)?)$/;

    if (typeof newOrderTemplate.quantityMultiplier === 'string' && regex.test(newOrderTemplate.quantityMultiplier))
        newOrderTemplate.quantityMultiplier = parseFloat(newOrderTemplate.quantityMultiplier.replace(',', '.'));

    if (typeof newOrderTemplate.limitPriceMultiplier === 'string' && regex.test(newOrderTemplate.limitPriceMultiplier))
        newOrderTemplate.limitPriceMultiplier = parseFloat(newOrderTemplate.limitPriceMultiplier.replace(',', '.'));

    if (typeof newOrderTemplate.stopPriceMultiplier === 'string' && regex.test(newOrderTemplate.stopPriceMultiplier))
        newOrderTemplate.stopPriceMultiplier = parseFloat(newOrderTemplate.stopPriceMultiplier.replace(',', '.'));

    let response;

    if (id)
        response = await axios.patch(`${ORDER_TEMPLATES_URL}/${id}`, newOrderTemplate);
    else
        response = await axios.post(`${ORDER_TEMPLATES_URL}/`, newOrderTemplate);
    return response.data;
}
