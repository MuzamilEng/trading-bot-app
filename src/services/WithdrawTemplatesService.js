import axios from './BaseService';
import { REACT_APP_API_URL as API_URL } from '@env';
const WITHDRAW_TEMPLATES_URL = `${API_URL}/withdrawtemplates`;

export async function getWithdrawTemplates(coin, page = 1) {
    const response = await axios.get(`${WITHDRAW_TEMPLATES_URL}/${coin}?page=${page}`);
    return response.data.rows;
}