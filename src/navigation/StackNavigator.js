import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../public/Login/Login';
import AlertsList from '../private/Alerts/AlertsList';
import DrawerNavigator from '../navigation/DrawerNavigator';

const Stack = createStackNavigator();

function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            <Stack.Screen name="AlertsList" component={AlertsList} />
        </Stack.Navigator>
    )
}

export default StackNavigator;