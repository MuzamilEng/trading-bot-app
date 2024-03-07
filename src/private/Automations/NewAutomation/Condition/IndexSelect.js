import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Picker from 'react-native-picker-select';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - indexes
 * - onChange
 */
function IndexSelect(props) {

    const [indexes, setIndexes] = useState([]);
    const [index, setIndex] = useState('');

    useEffect(() => {
        setIndexes(props.indexes || []);
    }, [props.indexes])

    function onChange(value) {
        if (!value) return;
        setIndex(value);
        props.onChange(props.indexes.find(ix => ix.eval === value));
    }

    function getOptionText(symbol, variable) {
        return variable.startsWith('WALLET') ? `${symbol}:${variable}` : variable;
    }

    return (
        <Picker
            value={index}
            onValueChange={onChange}
            style={{
                ...pickerSelectStyles,
                iconContainer: {
                    top: 0,
                    right: 12
                }
            }}
            items={
                indexes.map(item => {
                    return {
                        label: getOptionText(item.symbol, item.variable),
                        value: item.eval
                    }
                })
            }
            Icon={() => <Icon name="chevron-down" size={24} color="black" />}
            useNativeAndroidPickerStyle={false} />
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 30,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold',
        color: 'black'
    },
    inputAndroid: {
        height: 30,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold',
        color: 'black'
    }
})

export default IndexSelect;