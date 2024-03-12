import React, { useState, useEffect } from 'react';
import { Text,View, StyleSheet } from 'react-native';
import { Button, Overlay, Input, useTheme } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';

/**
 * props:
 * - label
 * - value
 * - valueMultiplier
 * - options
 * - onChange
 */
function MultiplierInput(props) {

    const { theme } = useTheme();

    const [value, setValue] = useState('0.00');
    const [valueMultiplier, setValueMultiplier] = useState('1.00');
    const [showInput, setShowInput] = useState(true);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        setValue(props.value);
        setValueMultiplier(props.valueMultiplier);
        setShowInput(/[A-Z]/i.test(props.value) ? false : true);
    }, [props.value, props.valueMultiplier])

    function onRefresh() {
        setValue('');
        setValueMultiplier('1.00');
        setShowInput(!showInput);
    }

    const icon = <Icon.Button
        name="refresh-cw"
        size={20}
        color="black"
        style={{ paddingTop: showInput ? 10 : 20 }}
        onPress={evt => onRefresh()}
        backgroundColor='transparent' />

    function renderInput() {
        return (
            <Input
                placeholder={`${value || '0.00'}`}
                keyboardType="decimal-pad"
                leftIcon={icon}
                onChangeText={setValue}
                value={`${value}`} />
        )
    }

    function renderPicker() {
        return (
            <View style={styles.row}>
                {icon}
                <View style={pickerSelectStyles.wrapper}>
            <Dropdown
                style={[pickerSelectStyles.dropdown, { borderColor: 'gray' }]}
                placeholderStyle={pickerSelectStyles.placeholderStyle}
                selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                iconStyle={pickerSelectStyles.iconStyle}
                defaultValue={value}
                valueField="value"
                labelField={'label'}
                placeholder='Select Type'
                value={value}
                searchPlaceholder="Search..."
                data={props?.options}
                onChange={setValue}
            />
        </View>
                {/* <View style={{ flex: 1 }}>
                    <Picker
                        value={`${value}`}
                        onValueChange={setValue}
                        useNativeAndroidPickerStyle={false}
                        Icon={() => <Icon name="chevron-down" size={24} color="black" />}
                        items={props.options}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                top: 20,
                                right: 12
                            }
                        }} />
                </View> */}
            </View>
        )
    }

    function onSavePress(event) {
        props.onChange({ value, valueMultiplier });
        setShowOverlay(false);
    }

    return (
        <>
            <Text style={styles.label}>{props.label}</Text>
            <Button
                title={`${value || '0.00'} ${value === 'QUOTE_QTY' ? "=" : "x"} ${valueMultiplier || '1.00'}`}
                titleStyle={styles.buttonText}
                type="clear"
                buttonStyle={{ width: '100%' }}
                onPress={evt => setShowOverlay(true)}
                iconRight={true}
                icon={<Icon name="edit" size={20} color="black" />} />
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={showOverlay}
                onBackdropPress={evt => setShowOverlay(false)}>
                <Text style={{ ...theme.h1, paddingLeft: 10 }}>{props.label}</Text>
                {showInput ? renderInput() : renderPicker()}
                <Text style={styles.label}>{value === "QUOTE_QTY" ? "Quantity: " : "Multiplier: "}</Text>
                <Input
                    placeholder='1.00'
                    keyboardType='decimal-pad'
                    leftIcon={value === "QUOTE_QTY" ? <></> : <Icon name="x" size={20} color="black" />}
                    onChangeText={text => setValueMultiplier(text.replace(',', '.'))}
                    value={`${valueMultiplier}`} />
                <Button
                    title=" Save Config"
                    onPress={onSavePress}
                    style={{ padding: 10 }}
                    icon={<Icon name="save" size={20} color="white" />} />
            </Overlay>
        </>
    )

}

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
})

const styles = StyleSheet.create({
    label: {
        fontWeight: 'bold',
        color: 'grey',
        paddingLeft: 10,
        fontSize: 16
    },
    buttonText: {
        flex: 1,
        paddingLeft: 4,
        fontWeight: 'normal',
        color: 'black',
        textAlign: 'justify'
    },
    overlay: {
        flex: 0,
        width: '90%',
        height: 270
    },
    row: {
        flexDirection: 'row',
        width: '100%'
    }
})

export default MultiplierInput;