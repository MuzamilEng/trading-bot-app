import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
function SelectFiat(props) {
    const [fiat, setFiat] = useState('USD');

    useEffect(() => {
        AsyncStorage.getItem('fiat')
            .then(value => {
                setFiat(value || 'USD');
                props?.onChange(value || 'USD');
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <View style={styles.wrapper}>
        <DropDownPicker
defaultValue={fiat}
items={[
    { label: 'AUD', value: 'AUD' },
    { label: 'BRL', value: 'BRL' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
    { label: 'NGN', value: 'NGN' },
    { label: 'TRY', value: 'TRY' },
    { label: 'UAH', value: 'UAH' },
    { label: 'USD', value: 'USD' }
]}
// containerStyle={{ height: 40 }}
style={{ ...styles, iconContainer: { top: 10, right: 12 } }}
// dropDownStyle={{ ...styles.dropDownStyle }}
onChangeItem={item => {
    AsyncStorage.setItem('fiat', item.value);
    setFiat(item.value);
    props?.onChange(item.value);
}}
/>
        </View>
    );
}

const styles = StyleSheet.create({
    inputAndroid: {
        marginTop: 10,
        height: 40,
        paddingHorizontal: 24,
        fontSize: 16,
        alignItems: 'stretch'
    },
    dropDownStyle: {
        backgroundColor: '#fafafa'
    },
    wrapper:{
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    }
});

export default SelectFiat;