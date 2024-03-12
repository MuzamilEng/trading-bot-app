import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - interval
 * - onChange
 */
function MonitorInterval(props) {

    const [interval, setInterval] = useState('1m');
    const data = [
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
    ]

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
            <View style={pickerSelectStyles.wrapper}>
            <Dropdown
                style={[pickerSelectStyles.dropdown, { borderColor: 'gray' }]}
                placeholderStyle={pickerSelectStyles.placeholderStyle}
                selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                iconStyle={pickerSelectStyles.iconStyle}
                defaultValue={interval}
                valueField="value"
                labelField={'label'}
                placeholder='Select Interval'
                value={interval}
                searchPlaceholder="Search..."
                data={data}
                onChange={onChange}
            />
        </View>
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
        wrapper: {
            margin: 10,
            paddingTop: 10,
        },
        dropdown: {
            height: 50,
            borderColor: 'gray',
            borderWidth: 0.5,
            borderRadius: 8,
            paddingHorizontal: 8,
        },
        icon: {
            marginRight: 5,
        },
        label: {
            position: 'absolute',
            backgroundColor: 'white',
            left: 22,
            top: 8,
            zIndex: 999,
            paddingHorizontal: 8,
            fontSize: 14,
        },
        placeholderStyle: {
            fontSize: 16,
        },
        selectedTextStyle: {
            fontSize: 16,
        },
        iconStyle: {
            width: 20,
            height: 20,
        },
        inputSearchStyle: {
            height: 40,
            fontSize: 16,
        },
    });

export default MonitorInterval;