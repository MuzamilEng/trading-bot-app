import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, View } from 'react-native';

/**
 * props:
 * - type
 * - onChange
 */
function MarginType(props) {
    return (
        <View style={styles.wrapper}>
            <Dropdown
                style={[styles.dropdown, { borderColor: 'gray' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                defaultValue={props?.type}
                valueField="value"
                labelField={'label'}
                placeholder='Select Type'
                value={props?.type}
                searchPlaceholder="Search..."
                data={[
                    { label: 'CROSSED', value: 'CROSSED' },
                    { label: 'ISOLATED', value: 'ISOLATED' }
                ]}
                onChange={props?.onChange}
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

export default MarginType;