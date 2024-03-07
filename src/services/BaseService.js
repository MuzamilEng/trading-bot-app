import axios from 'axios';
// import { ORIGIN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function configBaseService(navigator) {
    const ORIGIN = 'http://localhost:3000'
    axios.interceptors.request.use(
        async (config) => {
            config.headers.Authorization = await AsyncStorage.getItem('token');
            config.headers.origin = ORIGIN;
            // console.log(config.headers.origin);
            return config;
        },
        (error) => Promise.reject(error)
    )

    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && [401, 403].includes(error.response.status)) {
                return navigator.navigate('Login', { status: error.response.status, text: 'Provide a valid email and password.' });
            }
            else
                return Promise.reject(error);
        });
}

export default axios;