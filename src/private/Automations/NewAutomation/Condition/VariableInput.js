import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input } from 'react-native-elements';
import IndexSelect from './IndexSelect';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - value
 * - indexes
 * - onChange
 */
function VariableInput(props) {

    const [indexes, setIndexes] = useState([]);
    const [value, setValue] = useState('');
    const [showInput, setShowInput] = useState(true);

    useEffect(() => {
        setValue(props.value);
    }, [props.value])

    useEffect(() => {
        setIndexes(props.indexes || []);
    }, [props.indexes])

    function onChange(text) {
        setValue(text);
        props.onChange(text);
    }

    const icon = <Icon.Button
        name="refresh-cw"
        size={20}
        color="black"
        backgroundColor="transparent"
        style={{ paddingTop: showInput ? 10 : 20 }}
        onPress={evt => setShowInput(!showInput)} />

    function renderInput() {
        return (
            <View style={styles.row}>
                <Input
                    placeholder={`${value}`}
                    keyboardType='default'
                    autoCapitalize='none'
                    leftIcon={icon}
                    onChangeText={onChange}
                    value={`${value}`} />
            </View>
        )
    }

    function renderPicker() {
        return (
            <View style={styles.row}>
                {icon}
                <View style={styles.flex}>
                    <IndexSelect indexes={indexes} onChange={ix => onChange(ix.eval)} />
                </View>
            </View>
        )
    }

    return (
        <>
            {
                showInput
                    ? renderInput()
                    : renderPicker()
            }
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        width: '100%',
        flex: 0,
        height: 60,
        marginBottom: 10
    },
    flex: {
        flex: 1,
        paddingTop: 15
    }
})

export default VariableInput;