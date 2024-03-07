import React, { useState, useEffect } from 'react';
import Picker from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

/**
 * props:
 * - isFuture
 * - onChange
 */
function SelectQuote(props) {

    const [quote, setQuote] = useState('USDT');
    const [isFuture, setIsFuture] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('quote')
            .then(value => {
                setQuote(value || 'USDT');
                props.onChange(value || 'USDT');
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
        <Picker
            value={quote}
            useNativeAndroidPickerStyle={false}
            onValueChange={value => {
                AsyncStorage.setItem('quote', value);
                setQuote(value);
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
            items={getItems()} />
    )
}

const styles = StyleSheet.create({
    inputAndroid: {
        marginVertical: 10,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch'
    },
    inputIOS: {
        marginVertical: 10,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch'
    }
})

export default SelectQuote;