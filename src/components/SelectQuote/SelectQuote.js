import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';


/**
 * props:
 * - isFuture
 * - onChange
 */
function SelectQuote(props) {
    console.log(props, 'props');

    const [quote, setQuote] = useState('USDT');
    const [isFuture, setIsFuture] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('quote')
            .then(value => {
                setQuote(value || 'USDT');
                props?.onChange(value || 'USDT');
            })
            .catch(err => console.error(err));
    }, [])

    useEffect(() => {
        setIsFuture(props.isFuture ? true : false);
    }, [props.isFuture])

    function getItems() {
        return isFuture
            ? [
                { label: 'BUSD', value: 'BUSD' },
                { label: 'USDT', value: 'USDT' }
            ]
            : [
                { label: 'BRL', value: 'BRL' },
                { label: 'BTC', value: 'BTC' },
                { label: 'ETH', value: 'ETH' },
                { label: 'EUR', value: 'EUR' },
                { label: 'GBP', value: 'GBP' },
                { label: 'USD', value: 'USD' },
                { label: 'USDT', value: 'USDT' }
            ]
    }

    return (
        <View style={styles.wrapper}>
        <Dropdown
            style={[styles.dropdown, { borderColor: 'gray' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            defaultValue={quote}
            valueField="value"
            labelField={'label'}
            placeholder='Select Quote'
            value={quote}
            searchPlaceholder="Search..."
            data={getItems()}
            onChange={value => {
                setQuote(value?.value);
                props.onChange(value?.value);
            }}
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

export default SelectQuote;