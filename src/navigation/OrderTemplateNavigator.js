import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import OrderTemplatesList from '../private/OrderTemplates/OrderTemplatesList';
import NewOrderTemplate from '../private/OrderTemplates/NewOrderTemplate';

const Stack = createStackNavigator();

function OrderTemplateNavigator() {
    return (
        <Stack.Navigator initialRouteName="OrderTemplatesList" screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="OrderTemplatesList" component={OrderTemplatesList} />
            <Stack.Screen name="NewOrderTemplate" component={NewOrderTemplate} />
        </Stack.Navigator>
    )
}

export default OrderTemplateNavigator;