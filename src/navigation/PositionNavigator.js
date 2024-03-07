import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PositionsList from '../private/Positions/PositionsList';
import PositionView from '../private/Positions/PositionView';
import NewOrder from '../private/Orders/NewOrder';

const Stack = createStackNavigator();

function PositionNavigator() {
    return (
        <Stack.Navigator initialRouteName="OrdersList" screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="PositionsList" component={PositionsList} />
            <Stack.Screen name="PositionView" component={PositionView} />
            <Stack.Screen name="NewOrder" component={NewOrder} />
        </Stack.Navigator>
    )
}

export default PositionNavigator;