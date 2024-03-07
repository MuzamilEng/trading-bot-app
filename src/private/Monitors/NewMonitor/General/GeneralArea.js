import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-elements';
import SwitchInput from '../../../../components/SwitchInput/SwitchInput';
import MonitorType from './MonitorType';
import MonitorInterval from './MonitorInterval';

/**
 * props:
 * - monitor
 * - onChange
 */
function GeneralArea(props) {

    const { theme } = useTheme();

    const DEFAULT_MONITOR = {
        type: 'CANDLES',
        symbol: 'BTCUSDT',
        interval: '1m',
        isActive: false,
        logs: false
    }

    const [monitor, setMonitor] = useState(DEFAULT_MONITOR);

    useEffect(() => {
        setMonitor(props.monitor);
    }, [props.monitor])

    function onChange(newProp) {
        setMonitor(prevData => ({ ...prevData, [newProp.name]: newProp.value }));
        props.onChange(newProp);
    }

    return (
        <View style={theme.container}>
            <View style={{ ...theme.inputContainer, marginVertical: 15 }}>
                <ScrollView>
                    <MonitorType type={monitor.type} onChange={value => onChange({ name: 'type', value })} />
                    {
                        monitor.type === 'CANDLES'
                            ? <MonitorInterval interval={monitor.interval} onChange={value => onChange({ name: 'interval', value })} />
                            : <></>
                    }
                    <View style={styles.row}>
                        <SwitchInput text="Is Active?" isChecked={monitor.isActive} onChange={value => onChange({ name: 'isActive', value })} />
                        <SwitchInput text="Enable Logs?" isChecked={monitor.logs} onChange={value => onChange({ name: 'logs', value })} />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5
    }
})

export default GeneralArea;