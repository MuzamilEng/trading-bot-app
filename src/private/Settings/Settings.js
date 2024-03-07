import React, { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useTheme, Input, Button } from 'react-native-elements';
import { getSettings, updateSettings } from '../../services/SettingsService';
import Toast from '../../components/Toast/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Settings({ navigation, route }) {

    const { theme } = useTheme();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [limit, setLimit] = useState('');
    const [telegramChat, setTelegramChat] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [futuresKey, setFuturesKey] = useState('');
    const [futuresSecret, setFuturesSecret] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasFutures, setHasFutures] = useState(false);
    const [notification, setNotification] = useState(null);

    function clearScreen() {
        setSecretKey('');
        setFuturesSecret('');
        setPassword('');
        setConfirmPassword('');
        setIsLoading(false);
        setNotification(null);
    }

    useEffect(() => {
        AsyncStorage.getItem("hasFutures")
            .then(value => {
                setHasFutures(value === "true");
                return getSettings();
            })
            .then(settings => {
                setName(settings.name);
                setEmail(settings.email);
                setPhone(settings.phone);
                setTelegramChat(settings.telegramChat);
                setAccessKey(settings.accessKey);
                setFuturesKey(settings.futuresKey);
                setLimit(settings.limit ? settings.limit.name : 'none');
                clearScreen();
            })
            .catch(err => {
                clearScreen();
                setNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            })
    }, [])

    function onSavePress() {
        setIsLoading(true);

        if (password && password !== confirmPassword)
            return setNotification({ type: 'error', text: 'Password and Confirm Password must be equals!' });

        updateSettings({
            name,
            email,
            password,
            telegramChat,
            phone,
            accessKey,
            secretKey,
            futuresKey,
            futuresSecret
        })
            .then(result => {
                clearScreen();
                setNotification({ type: 'success', text: 'Settings saved successfuly!' });
            })
            .catch(err => {
                clearScreen();
                setNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            })

    }

    return (
        <ScrollView>
            <View style={theme.container}>
                <View style={theme.inputContainer}>
                    <Input
                        label="Name"
                        placeholder="John Doe"
                        autoComplete='name'
                        autoCapitalize='words'
                        onChangeText={name => setName(name)}
                        value={name} />
                    <Input
                        label="E-mail"
                        placeholder="contact@domain.com"
                        autoComplete='email'
                        autoCapitalize='none'
                        keyboardType='email-address'
                        onChangeText={email => setEmail(email)}
                        value={email} />
                    <Input
                        label="Limit Plan"
                        placeholder="none"
                        disabled={true}
                        value={limit} />
                    <Input
                        label="New Password"
                        autoComplete='password-new'
                        autoCapitalize='none'
                        secureTextEntry={true}
                        onChangeText={password => setPassword(password)}
                        value={password} />
                    {
                        password
                            ? <Input
                                label="Confirm Password"
                                autoCapitalize='none'
                                secureTextEntry={true}
                                onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
                                value={confirmPassword} />
                            : <></>
                    }
                    <Input
                        label="Cellphone"
                        placeholder="+5551123456789"
                        autoComplete='tel'
                        keyboardType='phone-pad'
                        onChangeText={phone => setPhone(phone)}
                        value={phone} />
                    <Input
                        label="Telegram Chat ID"
                        placeholder="-12345678"
                        keyboardType='numeric'
                        onChangeText={telegramChat => setTelegramChat(telegramChat)}
                        value={telegramChat} />
                    <Input
                        label="Spot Access Key"
                        placeholder="Your Binance Spot Access Key"
                        autoCapitalize='none'
                        onChangeText={accessKey => setAccessKey(accessKey)}
                        value={accessKey} />
                    <Input
                        label="Spot Secret Key"
                        placeholder="Your Binance Spot Secret Key"
                        autoCapitalize='none'
                        secureTextEntry={true}
                        onChangeText={secretKey => setSecretKey(secretKey)}
                        value={secretKey} />
                    {
                        hasFutures
                            ? (
                                <>
                                    <Input
                                        label="Futures Access Key"
                                        placeholder="Your Binance Futures Access Key"
                                        autoCapitalize='none'
                                        onChangeText={futuresKey => setFuturesKey(futuresKey)}
                                        value={futuresKey} />
                                    <Input
                                        label="Futures Secret Key"
                                        placeholder="Your Binance Futures Secret Key"
                                        autoCapitalize='none'
                                        secureTextEntry={true}
                                        onChangeText={futuresSecret => setFuturesSecret(futuresSecret)}
                                        value={futuresSecret} />
                                </>
                            )
                            : <></>
                    }
                    <Button
                        title={isLoading ? <ActivityIndicator /> : "Save Settings"}
                        style={{ padding: 10 }}
                        onPress={onSavePress} />
                </View>
            </View>
            {
                notification
                    ? <Toast type={notification.type} text={notification.text} visible={!!notification.type} onDismiss={evt => clearScreen()} />
                    : <></>
            }
        </ScrollView>
    )
}

export default Settings;