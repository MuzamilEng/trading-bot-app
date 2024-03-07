import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Picker from 'react-native-picker-select';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - type
 * - isFuture
 * - onChange
 */
function SelectType(props) {

    const [type, setType] = useState('MARKET');
    const [isFuture, setIsFuture] = useState(false);

    useEffect(() => {
        setType(props.type);
    }, [props.type])

    useEffect(() => {
        setIsFuture(props.isFuture ? true : false);
    }, [props.isFuture])

    function getTypes(isFuture) {
        const types = [
            { label: 'Limit', value: 'LIMIT' },
            { label: 'Market', value: 'MARKET' },
        ]

        isFuture
            ? types.push(...[
                { label: 'Stop Loss Limit', value: 'STOP' },
                { label: 'Stop Loss Market', value: 'STOP_MARKET' },
                { label: 'Take Profit Limit', value: 'TAKE_PROFIT' },
                { label: 'Take Profit Market', value: 'TAKE_PROFIT_MARKET' },
                { label: 'Trailing Stop Market', value: 'TRAILING_STOP_MARKET' }
            ])
            : types.push(...[
                { label: 'Stop Loss Limit', value: 'STOP_LOSS_LIMIT' },
                { label: 'Take Profit Limit', value: 'TAKE_PROFIT_LIMIT' },
                { label: 'Trailing Stop', value: 'TRAILING_STOP' }
            ]);

        return types;
    }

    return (
        <Picker
            value={type}
            useNativeAndroidPickerStyle={false}
            onValueChange={value => {
                setType(value);
                props.onChange(value);
            }}
            style={{
                ...styles,
                iconContainer: {
                    top: 10,
                    right: 12
                }
            }}
            Icon={() => <Icon name="chevron-down" size={24} color="black" />}
            items={getTypes(isFuture)} />
    )
}

const styles = StyleSheet.create({
    inputAndroid: {
        marginVertical: 15,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold'
    },
    inputIOS: {
        marginVertical: 15,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold'
    }
})

export default SelectType;