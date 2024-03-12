import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - value
 * - onChange
 */
function QuantityInput(props) {

    const [value, setValue] = useState('');
    const [showInput, setShowInput] = useState(true);

    useEffect(() => {
        setValue(props.value);
        setShowInput(props.value.startsWith('M') ? false : true);
    }, [props.value])

    function onRefresh() {
        setValue('');
        props.onChange('');
        setShowInput(!showInput);
    }

    function onChange(text) {
        text = text.replace(',', '.');
        setValue(text);
        props.onChange(text);
    }

    const icon = <Icon.Button
        name="refresh-cw"
        size={20}
        color="black"
        style={{ paddingTop: showInput ? 10 : 20 }}
        backgroundColor="transparent"
        onPress={onRefresh} />

    function renderInput() {
        return <Input
            placeholder={`${value}`}
            keyboardType='decimal-pad'
            leftIcon={icon}
            value={`${value}`}
            onChangeText={onChange} />
    }

    function renderPicker() {
        return (
            <View style={styles.row}>
                {icon}
                <View style={{ flex: 1 }}>
                <View style={styles.wrapper}>
            <Dropdown
                style={[pickerStyles.dropdown, { borderColor: 'gray' }]}
                placeholderStyle={pickerStyles.placeholderStyle}
                selectedTextStyle={pickerStyles.selectedTextStyle}
                inputSearchStyle={pickerStyles.inputSearchStyle}
                iconStyle={pickerStyles.iconStyle}
                defaultValue={type}
                valueField="value"
                labelField={'label'}
                placeholder='Select Type'
                value={`${value}`}
                searchPlaceholder="Search..."
                data={[
                    { label: 'Max. Wallet', value: 'MAX_WALLET' },
                    { label: 'Min. Notional', value: 'MIN_NOTIONAL' }
                ]}
                onChange={onChange}
            />
        </View>
                </View>
            </View>
        )
    }

    return (
        <>
            <Text style={styles.label}>Quantity:</Text>
            {
                showInput
                    ? renderInput()
                    : renderPicker()
            }
        </>
    )
}

const pickerStyles = StyleSheet.create({
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

const styles = StyleSheet.create({
    row: {
        width: '100%',
        flexDirection: 'row'
    },
    label: {
        fontWeight: 'bold',
        color: 'grey',
        paddingLeft: 10,
        fontSize: 16
    }
})

export default QuantityInput;