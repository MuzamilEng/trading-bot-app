import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Switch, useTheme } from 'react-native-elements';

/**
 * props:
 * - text
 * - isChecked
 * - onChange
 */
function SwitchInput(props) {

    const { theme } = useTheme();

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(props.isChecked);
    }, [props.isChecked])

    function onCheck(value) {
        setChecked(value);
        props.onChange(value);
    }

    return (
        <View style={styles.view}>
            <Text style={{ ...theme.h2, ...styles.label }}>{props.text}</Text>
            <Switch value={checked} onValueChange={value => onCheck(value)} />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        width: '50%',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    label: {
        marginBottom: 10
    }
})

export default SwitchInput;