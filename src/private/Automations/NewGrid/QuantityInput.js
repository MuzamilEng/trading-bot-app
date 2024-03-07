import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import Picker from 'react-native-picker-select';
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
                    <Picker
                        value={`${value}`}
                        onValueChange={onChange}
                        useNativeAndroidPickerStyle={false}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                top: 20,
                                right: 12
                            }
                        }}
                        Icon={() => <Icon name="chevron-down" size={24} color="black" />}
                        items={[
                            { label: 'Max. Wallet', value: 'MAX_WALLET' },
                            { label: 'Min. Notional', value: 'MIN_NOTIONAL' }
                        ]} />
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginVertical: 15,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        alignItems: 'stretch'
    },
    inputAndroid: {
        marginVertical: 15,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        alignItems: 'stretch'
    }
})

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