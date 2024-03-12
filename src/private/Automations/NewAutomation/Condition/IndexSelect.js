import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, View } from 'react-native';

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
        <View style={styles.wrapper}>
            <Dropdown
                style={[styles.dropdown, { borderColor: 'gray' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                defaultValue={index}
                valueField="value"
                labelField={'label'}
                placeholder='Select Index'
                value={index}
                searchPlaceholder="Search..."
                data={
                    indexes.map(item => {
                        return {
                            label: getOptionText(item.symbol, item.variable),
                            value: item.eval
                        }
                    })
                }
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

export default IndexSelect;