import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Picker from 'react-native-picker-select';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - interval
 * - onChange
 */
function MonitorInterval(props) {

    const [interval, setInterval] = useState('1m');

    useEffect(() => {
        setInterval(props.interval || '1m');
    }, [props.interval])

    function onChange(value) {
        setInterval(value);
        props.onChange(value);
    }

    return (
        <>
            <Text style={styles.label}>Interval:</Text>
            <Picker
                value={interval}
                onValueChange={onChange}
                style={{
                    ...pickerSelectStyles,
                    iconContainer: {
                        top: 10,
                        right: 5
                    }
                }}
                Icon={() => <Icon name="chevron-down" size={24} color="black" />}
                useNativeAndroidPickerStyle={false}
                items={[
                    { label: '1 minute', value: '1m' },
                    { label: '3 minutes', value: '3m' },
                    { label: '5 minutes', value: '5m' },
                    { label: '15 minutes', value: '15m' },
                    { label: '30 minutes', value: '30m' },
                    { label: '1 hour', value: '1h' },
                    { label: '2 hours', value: '2h' },
                    { label: '4 hours', value: '4h' },
                    { label: '6 hours', value: '6h' },
                    { label: '8 hours', value: '8h' },
                    { label: '12 hours', value: '12h' },
                    { label: '1 day', value: '1d' },
                    { label: '3 days', value: '3d' },
                    { label: '1 week', value: '1w' },
                    { label: '1 month', value: '1M' }
                ]} />
        </>
    )
}

const styles = StyleSheet.create({
    label: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 16
    }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginVertical: 15,
        height: 30,
        paddingRight: 5,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold',
        color: 'black'
    },
    inputAndroid: {
        marginVertical: 15,
        height: 30,
        paddingRight: 5,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold',
        color: 'black'
    }
})

export default MonitorInterval;