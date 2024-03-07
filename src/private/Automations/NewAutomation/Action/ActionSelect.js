import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Picker from 'react-native-picker-select';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - onChange
 */
function ActionSelect(props) {

    const [type, setType] = useState('');

    function onChange(value) {
        setType(value);
        props.onChange(value);
    }

    return <Picker
        value={type}
        onValueChange={onChange}
        style={{
            ...pickerSelectStyles,
            iconContainer: {
                top: 10,
                right: 12
            }
        }}
        Icon={() => <Icon name="chevron-down" size={24} color="black" />}
        useNativeAndroidPickerStyle={false}
        items={[
            { label: 'Alert via E-mail', value: 'ALERT_EMAIL' },
            { label: 'Alert via SMS', value: 'ALERT_SMS' },
            { label: 'Alert via Telegram', value: 'ALERT_TELEGRAM' },
            { label: 'Place Order', value: 'ORDER' },
            { label: 'Place Trailing', value: 'TRAILING' },
            { label: 'Withdraw Crypto', value: 'WITHDRAW' }
        ]} />
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginVertical: 15,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold',
        color: 'black'
    },
    inputAndroid: {
        marginVertical: 15,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold',
        color: 'black'
    }
})

export default ActionSelect;