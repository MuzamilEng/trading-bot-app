import axios from './BaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { REACT_APP_API_URL } from "@env";
const apiUrl = 'http://192.168.31.150:3002' || process.env.REACT_APP_API_URL // for mobile devices
// const apiUrl = 'http://localhost:3002' || process.env.REACT_APP_API_URL  // for desktop devices
// console.log(apiUrl, "api url");
export async function doLogin(email, password) {
    const loginUrl = `${apiUrl}/login`;
    const response = await axios.post(loginUrl, { email, password });
    if (response && response.data) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('id', `${response.data.id}`);
        await AsyncStorage.setItem('hasFutures', `${response.data.hasFutures}`);
        return response.data;
    }
}

export async function doLogout() {
    const logoutUrl = `${apiUrl}/logout`;
    const response = await axios.post(logoutUrl, {});
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('id');
    AsyncStorage.removeItem('hasFutures');
    AsyncStorage.removeItem('push');
    return response ? response.data : true;
}