import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

/**
 * props:
 * - type
 * - onChange
 */
function MonitorType(props) {

    const [type, setType] = useState('CANDLES');

    useEffect(() => {
        setType(props.type || 'CANDLES');
    }, [props.type])

    function onChange(value) {
        setType(value);
        props.onChange(value);
    }

    return (
        <>
            <Text style={styles.label}>Type:</Text>
            <View style={pickerSelectStyles.wrapper}>
            <Dropdown
                style={[pickerSelectStyles.dropdown, { borderColor: 'gray' }]}
                placeholderStyle={pickerSelectStyles.placeholderStyle}
                selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                iconStyle={pickerSelectStyles.iconStyle}
                defaultValue={type}
                valueField="value"
                labelField={'label'}
                placeholder='Select Type'
                value={type}
                searchPlaceholder="Search..."
                data={[
                    { label: 'Candles', value: 'CANDLES' }
                ]}
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
export default MonitorType;