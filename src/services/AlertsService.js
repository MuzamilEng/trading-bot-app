import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserAlerts } from './SettingsService';

async function loadAlerts() {
    const alerts = await getUserAlerts();
    await saveAlert(alerts);
    return alerts;
}

export async function saveAlert(alert) {
    const alerts = await AsyncStorage.getItem('alerts');
    const savedAlerts = JSON.parse(alerts) || [];

    if (Array.isArray(alert))
        savedAlerts.push(...alert);
    else
        savedAlerts.push(alert);

    return AsyncStorage.setItem('alerts', JSON.stringify(savedAlerts));
}

export async function getAlerts() {
    await loadAlerts();

    const response = await AsyncStorage.getItem('alerts');
    console.log(response , "alert response");
    return response ? JSON.parse(response) : [];
}

export async function hasAlerts() {
    const response = await getAlerts();
    if (!response) return false;
    return response.length > 0;
}

export async function deleteAllAlerts() {
    return AsyncStorage.removeItem('alerts');
}