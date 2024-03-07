import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme, Tab, Button } from 'react-native-elements';
import HeaderRow from '../../../components/HeaderRow/HeaderRow';
import { Feather as Icon } from '@expo/vector-icons';
import GeneralArea from './GeneralArea';
import ConditionsArea from './Condition/ConditionsArea';
import ActionsArea from './Action/ActionsArea';
import { saveAutomation } from '../../../services/AutomationsService';

function NewAutomation({ route, navigation }) {

    const { theme } = useTheme();

    const DEFAULT_AUTOMATION = {
        symbol: 'BTCUSDT',
        name: '',
        actions: [],
        conditions: '',
        schedule: '',
        logs: false,
        isActive: false
    }

    const [automation, setAutomation] = useState(DEFAULT_AUTOMATION);
    const [tabIndex, setTabIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (route.params.automation)
            setAutomation(route.params.automation);
        else
            setAutomation({ ...DEFAULT_AUTOMATION });
        setError('');
    }, [route.params])

    function onPress() {
        setError('');

        if (!automation.actions || !automation.actions.length) return setError('You need to have at least one action.');
        if (!automation.conditions && !automation.schedule) return setError('You need to have at least one condition.');

        const indexes = automation.conditions
            .split(' && ')
            .map(c => c.split("'"))
            .flat()
            .filter(c => c.indexOf(':') !== -1)

        automation.indexes = [...new Set(indexes)].join(',');

        setIsLoading(true);
        saveAutomation(automation.id, automation)
            .then(result => {
                setIsLoading(false);
                navigation.navigate('Automations', { screen: 'AutomationsList', params: { result } });
            })
            .catch(err => {
                setIsLoading(false);
                setError(err.response ? err.response.data : err.message);
            })
    }

    return (
        <>
            <View style={theme.page}>
                <View style={styles.header}>
                    <HeaderRow
                        symbol={automation.symbol}
                        onSymbolChange={symbol => setAutomation({ ...DEFAULT_AUTOMATION, symbol })}
                        onBackPress={evt => navigation.navigate('AutomationsList')} />
                </View>

                <Tab
                    value={tabIndex}
                    onChange={setTabIndex}
                    indicatorStyle={{ backgroundColor: 'black' }}>
                    <Tab.Item buttonStyle={styles.tabButton} style={styles.tab} icon={<Icon name="settings" color="black" size={20} />} />
                    <Tab.Item buttonStyle={styles.tabButton} style={styles.tab} icon={<Icon name="help-circle" color="black" size={20} />} />
                    <Tab.Item buttonStyle={styles.tabButton} style={styles.tab} icon={<Icon name="play-circle" color="black" size={20} />} />
                </Tab>

                {
                    tabIndex === 0
                        ? <GeneralArea
                            automation={automation}
                            onChange={data => setAutomation({ ...automation, [data.name]: data.value })}
                            type={route.params.type} />
                        : <></>
                }
                {
                    tabIndex === 1
                        ? <ConditionsArea
                            type={route.params.type}
                            conditions={automation.conditions}
                            symbol={automation.symbol}
                            onChange={data => setAutomation({ ...automation, conditions: data })} />
                        : <></>
                }
                {
                    tabIndex === 2
                        ? <ActionsArea
                            type={route.params.type}
                            actions={automation.actions}
                            symbol={automation.symbol}
                            onChange={data => setAutomation({ ...automation, actions: data })} />
                        : <></>
                }

                <View style={styles.button}>
                    <Button
                        title={isLoading ? <ActivityIndicator /> : " Save Automation"}
                        disabled={isLoading}
                        icon={() => <Icon name="save" size={20} color="white" />}
                        onPress={evt => onPress()} />
                    {
                        error
                            ? <Text style={{ ...theme.alert, marginHorizontal: 0 }}>{error}</Text>
                            : <></>
                    }
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        flex: 0,
        height: 40,
        backgroundColor: '#ccc'
    },
    tabButton: {
        backgroundColor: '#ccc'
    },
    tab: {
        backgroundColor: '#ccc',
        paddingBottom: 6
    },
    button: {
        margin: 10,
        paddingHorizontal: 10
    }
})

export default NewAutomation;