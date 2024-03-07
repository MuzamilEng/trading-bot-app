import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import logo from '../../../assets/logo.png';
import { Image, useTheme, Input, CheckBox, Button } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import { doLogin } from '../../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateSettings } from '../../services/SettingsService';

import { configBaseService } from '../../services/BaseService';

import Constants from 'expo-constants';
// import * as Device from 'expo-Device';
import * as Notifications from 'expo-notifications';

function Login({ route, navigation }) {

    configBaseService(navigation);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { theme } = useTheme();

    function clearScreen() {
        if (!rememberMe)
            setEmail('');

        setPassword('');
        setError('');
        setIsLoading(false);
    }

    useEffect(() => {
        if (route.params) {
            clearScreen();
            setError(route.params.text);
        }

        AsyncStorage.getItem('email')
            .then(result => {
                if (result) {
                    setEmail(result);
                    setRememberMe(true);
                }
            })
    }, [route.params])

    async function onSignInPress() {
        console.log('login press');
        setIsLoading(true);
        try {
            const result = await doLogin(email, password)
            // console.log(result, 'email updated successfully ');
        } catch (error) {
            console.log(error.message, "error updating");
        }
        if (rememberMe)
            AsyncStorage.setItem('email', email);
        else
            AsyncStorage.removeItem('email');

        try {
            const result = await doLogin(email, password)
            // console.log(result, 'email updated successfully ');
            navigation.navigate('DrawerNavigator');
            if (result) {
                let pushToken = await AsyncStorage.getItem('push');
                // console.log(pushToken, 'push token');
                if (!pushToken || result.pushToken !== pushToken) {
                    pushToken = await registerForPushNotificationsAsync();
                    await updateSettings({ pushToken });
                }

                clearScreen();
                navigation.navigate('DrawerNavigator');
            }
        } catch (err) {
            clearScreen();
            navigation.navigate('DrawerNavigator');
            setError(err.response ? err.response.data : err.message)
        }
    }

  const registerForPushNotificationsAsync = async () => {
        let token;
        if (Constants?.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }

            const response = await Notifications.getExpoPushTokenAsync({ projectId: '40bada3e-f0c3-409d-8942-c34e6104f781' });
            token = response.data;
            console.log(token, "token123");
            AsyncStorage.setItem('push', token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    };

    return (
        <ScrollView style={{ backgroundColor: theme.backgroundColor }}>
            <View style={theme.container}>
                <Image source={logo} style={styles.logo} />
                <Text style={theme.h1}>Sign in to our platform</Text>
                <View style={theme.inputContainer}>
                    <Input
                        placeholder="Your email"
                        autoComplete='email'
                        autoCapitalize='none'
                        keyboardType='email-address'
                        value={email}
                        onChangeText={(text) => {setEmail(text); console.log(email, "email");}}
                        leftIcon={<Icon size={24} color='black' name='user' />}
                    />
                    <Input
                        placeholder="Your password"
                        autoComplete='password'
                        value={password}
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                        leftIcon={<Icon size={24} color='black' name='key' />}
                    />
                    <CheckBox title="Remember Me" checked={rememberMe} onPress={(evt) => setRememberMe(!rememberMe)} />
                    <Button title={isLoading ? <ActivityIndicator /> : "Sign In"} style={{ padding: 10 }} onPress={onSignInPress} />
                    {
                        error
                            ? <Text style={theme.alert}>{error}</Text>
                            : <></>
                    }
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 100,
        height: 100,
        marginTop: 50
    }
});

export default Login;