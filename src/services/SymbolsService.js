import axios from './BaseService';
import { REACT_APP_API_URL as API_URL } from '@env';
const SYMBOLS_URL = 'http://192.168.18.205:3002/symbols' || `${API_URL}/symbols`;
console.log(SYMBOLS_URL, "Symb");

export async function searchSymbols(search) {
    const response = await axios.get(`${SYMBOLS_URL}/?search=${search}&page=1&pageSize=10&onlyFavorites=false`);
    return response.data;
}

export async function getSymbol(symbol) {
    console.log(symbol, "inapi request");
    const response = await axios.get(`${SYMBOLS_URL}/${symbol}`);
    console.log(response.data, '1response');
    return response.data;
}