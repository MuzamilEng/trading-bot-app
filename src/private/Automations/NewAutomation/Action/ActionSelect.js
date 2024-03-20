import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

/**
 * props:
 * - onChange
 */
function ActionSelect(props) {

    const [type, setType] = useState('');
    const data = [
        { label: 'Alert via E-mail', value: 'ALERT_EMAIL' },
        { label: 'Alert via SMS', value: 'ALERT_SMS' },
        { label: 'Alert via Telegram', value: 'ALERT_TELEGRAM' },
        { label: 'Place Order', value: 'ORDER' },
        { label: 'Place Trailing', value: 'TRAILING' },
        { label: 'Withdraw Crypto', value: 'WITHDRAW' }
    ]

    function onChange(value) {
        setType(value?.value ? value.value : value);
        // console.log(value?.value, 'Action');
        props.onChange(value?.value ? value.value : value);
    }

    return (
        <View style={styles.wrapper}>
        <Dropdown
            style={[styles.dropdown, { borderColor: 'gray' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            defaultValue={type}
            valueField="value"
            labelField={'label'}
            placeholder='Select Type'
            value={type}
            searchPlaceholder="Search..."
            data={data}
            onChange={onChange}
        />
    </View>
    )
}

const styles = StyleSheet.create({
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

export default ActionSelect;