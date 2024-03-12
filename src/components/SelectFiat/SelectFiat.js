import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';
function SelectFiat(props) {
    const [fiat, setFiat] = useState('USD');
    const data = [
        { label: 'AUD', value: 'AUD' },
        { label: 'BRL', value: 'BRL' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' },
        { label: 'NGN', value: 'NGN' },
        { label: 'TRY', value: 'TRY' },
        { label: 'UAH', value: 'UAH' },
        { label: 'USD', value: 'USD' }
    ]

    const handleFiatChange = async (fiat) => {
        console.log(fiat?.value, 'setFiat');
        await AsyncStorage.setItem('fiat', fiat?.value);
        setFiat(fiat?.value);
        props?.onChange(fiat?.value);
      };

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
        <Dropdown
        style={[styles.dropdown, { borderColor: 'gray' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        defaultValue={fiat}
        valueField="value"
        labelField={'label'}
        placeholder='Select Fiat'
        value={fiat}
        searchPlaceholder="Search..."
        data={data}
        onChange={handleFiatChange}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        margin: 10,
        paddingTop: 10,
    },
    container: {
      backgroundColor: 'white',
      padding: 16,
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
export default SelectFiat;