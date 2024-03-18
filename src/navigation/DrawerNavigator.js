import React, { useMemo, useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerIcon from './DrawerIcon';
import AlertsButton from '../components/AlertsButton/AlertsButton';

import Dashboard from '../private/Dashboard/Dashboard';
import Reports from '../private/Reports/Reports';
import Wallet from '../private/Wallet/Wallet';
import MonitorNavigator from './MonitorNavigator';
import OrderTemplateNavigator from './OrderTemplateNavigator';
import OrderNavigator from './OrderNavigator';
import PositionNavigator from './PositionNavigator';
import AutomationNavigator from './AutomationNavigator';
import Settings from '../private/Settings/Settings';
import Logout from '../private/Logout/Logout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Payment from '../private/Payment/Payment';

const Drawer = createDrawerNavigator();

function DrawerNavigator({ navigation, route }) {

    const [hasFutures, setHasFutures] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("hasFutures")
            .then(value => setHasFutures(value === "true"));
    }, [])

    const alertsButton = useMemo(() => <AlertsButton navigation={navigation} />, [navigation])

    return (
        <Drawer.Navigator initialRouteName="Dashboard" screenOptions={{
            headerStyle: {
                backgroundColor: '#1F2937'
            },
            headerRight: () => alertsButton,
            headerTintColor: '#fff',
            drawerStyle: {
                backgroundColor: '#1F2937'
            },
            drawerLabelStyle: {
                color: '#fff'
            }
        }}>
            <Drawer.Screen name="Dashboard" component={Dashboard} options={{
                drawerIcon: config => <DrawerIcon name="pie-chart" />
            }} />
            <Drawer.Screen name="Subscription" component={Payment} options={{
                drawerIcon: config => <DrawerIcon name="pie-chart" />
            }} />
            <Drawer.Screen name="Reports" component={Reports} options={{
                drawerIcon: config => <DrawerIcon name="activity" />
            }} />
            <Drawer.Screen name="Wallet" component={Wallet} options={{
                drawerIcon: config => <DrawerIcon name="dollar-sign" />
            }} />
            <Drawer.Screen name="Orders" component={OrderNavigator} options={{
                drawerIcon: config => <DrawerIcon name="book-open" />
            }} />
            {
                hasFutures
                    ? (
                        <Drawer.Screen name="Positions" component={PositionNavigator} options={{
                            drawerIcon: config => <DrawerIcon name="fast-forward" />
                        }} />
                    )
                    : <></>
            }
            <Drawer.Screen name="Automations" component={AutomationNavigator} options={{
                drawerIcon: config => <DrawerIcon name="command" />
            }} />
            <Drawer.Screen name="Order Templates" component={OrderTemplateNavigator} options={{
                drawerIcon: config => <DrawerIcon name="layout" />
            }} />
            <Drawer.Screen name="Monitors" component={MonitorNavigator} options={{
                drawerIcon: config => <DrawerIcon name="monitor" />
            }} />
            <Drawer.Screen name="Settings" component={Settings} options={{
                drawerIcon: config => <DrawerIcon name="settings" />
            }} />
            <Drawer.Screen name="Logout" component={Logout} options={{
                drawerIcon: config => <DrawerIcon name="log-out" />,
                drawerItemStyle: {
                    borderTopColor: '#fff',
                    borderStyle: 'solid',
                    borderTopWidth: 1
                }
            }} />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator;