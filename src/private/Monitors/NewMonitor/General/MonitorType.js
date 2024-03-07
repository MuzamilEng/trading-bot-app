import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Picker from 'react-native-picker-select';
import { Feather as Icon } from '@expo/vector-icons';

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
            <Picker
                value={type}
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
                    { label: 'Candles', value: 'CANDLES' }
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

export default MonitorType;