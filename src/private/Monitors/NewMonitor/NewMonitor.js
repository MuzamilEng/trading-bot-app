import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme, Tab, Button } from 'react-native-elements';
import HeaderRow from '../../../components/HeaderRow/HeaderRow';
import { Feather as Icon } from '@expo/vector-icons';
import GeneralArea from './General/GeneralArea';
import IndexesArea from './Indexes/IndexesArea';
import { saveMonitor } from '../../../services/MonitorsService';

function NewMonitor({ route, navigation }) {

    const { theme } = useTheme();

    const DEFAULT_MONITOR = {
        type: 'CANDLES',
        symbol: 'BTCUSDT',
        interval: '1m',
        isActive: false,
        logs: false
    }

    const [monitor, setMonitor] = useState(DEFAULT_MONITOR);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        setError('');
        if (route.params.monitor)
            setMonitor({ ...route.params.monitor });
        else
            setMonitor({ ...DEFAULT_MONITOR });
    }, [route.params])

    function onPress() {
        setError('');
        setIsLoading(true);
        saveMonitor(monitor.id, monitor)
            .then(result => {
                setIsLoading(false);
                navigation.navigate('Monitors', { screen: 'MonitorsList', params: { monitor: result } });
            })
            .catch(err => {
                setIsLoading(false);
                setError(err.response ? err.response.data : err.message);
            })
    }

    function onIndexChange(indexes) {
        if (indexes && indexes.length) {
            const str = indexes.map(index => index.key + (index.params ? '_' + index.params.replace(/,/i, '_') : '')).join(',');
            if (monitor.indexes !== str)
                setMonitor({ ...monitor, indexes: str });
        }
        else
            setMonitor({ ...monitor, indexes: '' });
    }

    return (
        <>
            <View style={theme.page}>
                <View style={styles.header}>
                    <HeaderRow
                        symbol={monitor.symbol}
                        onBackPress={evt => navigation.navigate('Monitors', { screen: 'MonitorsList' })}
                        onSymbolChange={symbol => setMonitor({ ...monitor, symbol })} />
                </View>

                <Tab
                    value={tabIndex}
                    onChange={setTabIndex}
                    indicatorStyle={{ backgroundColor: 'black' }}>
                    <Tab.Item
                        buttonStyle={styles.tabButton}
                        style={styles.tab}
                        icon={<Icon name="settings" size={20} color="black" />} />

                    <Tab.Item
                        disabled={monitor.type === 'TICKER'}
                        disabledStyle={styles.tabButton}
                        buttonStyle={styles.tabButton}
                        style={styles.tab}
                        icon={<Icon name="bar-chart-2" size={20} color={monitor.type === 'TICKER' ? '#ccc' : 'black'} />} />
                </Tab>

                {
                    tabIndex === 0
                        ? <GeneralArea
                            monitor={monitor}
                            onChange={newProp => setMonitor({ ...monitor, [newProp.name]: newProp.value })} />
                        : <IndexesArea indexes={monitor?.indexes} onChange={onIndexChange} />
                }

                <View style={styles.button}>
                    <Button
                        title={isLoading ? <ActivityIndicator /> : " Save Monitor"}
                        disabled={isLoading}
                        onPress={evt => onPress()}
                        icon={() => <Icon name="save" size={20} color="white" />} />
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
        paddingBottom: 6,
        backgroundColor: '#ccc'
    },
    button: {
        margin: 10,
        paddingHorizontal: 10
    }
})

export default NewMonitor;