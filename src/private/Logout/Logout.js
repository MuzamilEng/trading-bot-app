import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { doLogout } from '../../services/AuthService';

function Logout({ navigation, route }) {

    useEffect(() => {
        doLogout()
            .then(result => navigation.navigate('Login', { text: 'Logged out successfully!' }))
            .catch(error => navigation.navigate('Login', { text: 'Logged out successfully!' }));
    }, [])

    return (
        <ActivityIndicator />
    )
}

export default Logout;