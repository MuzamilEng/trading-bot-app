import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, View } from 'react-native';

/**
 * props:
 * - type
 * - isFuture
 * - onChange
 */
function SelectType(props) {

    const [type, setType] = useState('MARKET');
    const [isFuture, setIsFuture] = useState(false);

    useEffect(() => {
        setType(props?.type);
    }, [props?.type])

    useEffect(() => {
        setIsFuture(props.isFuture ? true : false);
    }, [props.isFuture])

    function getTypes(isFuture) {
        const types = [
            { label: 'Limit', value: 'LIMIT' },
            { label: 'Market', value: 'MARKET' },
        ]

        isFuture
            ? types.push(...[
                { label: 'Stop Loss Limit', value: 'STOP' },
                { label: 'Stop Loss Market', value: 'STOP_MARKET' },
                { label: 'Take Profit Limit', value: 'TAKE_PROFIT' },
                { label: 'Take Profit Market', value: 'TAKE_PROFIT_MARKET' },
                { label: 'Trailing Stop Market', value: 'TRAILING_STOP_MARKET' }
            ])
            : types.push(...[
                { label: 'Stop Loss Limit', value: 'STOP_LOSS_LIMIT' },
                { label: 'Take Profit Limit', value: 'TAKE_PROFIT_LIMIT' },
                { label: 'Trailing Stop', value: 'TRAILING_STOP' }
            ]);

        return types;
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
                data={getTypes(isFuture)}
                onChange={value => {
                    setType(value?.value);
                    {console.log(type, "vale is changing") }
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

export default SelectType;