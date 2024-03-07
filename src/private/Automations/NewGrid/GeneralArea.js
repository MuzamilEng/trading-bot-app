import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme, Input } from 'react-native-elements';
import QuantityInput from './QuantityInput';
import SwitchInput from '../../../components/SwitchInput/SwitchInput';

/**
 * props:
 * - automation
 * - grid
 * - onAutomationChange
 * - onGridChange
 * - type
 */
function GeneralArea(props) {

    const { theme } = useTheme();

    const DEFAULT_AUTOMATION = {
        symbol: 'BTCUSDT',
        name: '',
        actions: [],
        conditions: '',
        schedule: '',
        logs: false,
        isActive: false
    }

    const DEFAULT_GRID = {
        lowerLimit: '',
        upperLimit: '',
        levels: '',
        quantity: ''
    }

    const [automation, setAutomation] = useState(DEFAULT_AUTOMATION);
    const [grid, setGrid] = useState(DEFAULT_GRID);

    useEffect(() => {
        setAutomation(props.automation);
    }, [props.automation])

    useEffect(() => {
        setGrid(props.grid);
    }, [props.grid])

    function onGridChange(newProp) {
        const newData = { ...grid, [newProp.name]: newProp.value };
        setGrid(newData);
        props.onGridChange(newProp);
    }

    function onAutomationChange(newProp) {
        const newData = { ...automation, [newProp.name]: newProp.value };
        setAutomation(newData);
        props.onAutomationChange(newProp);
    }

    return (
        <View style={theme.container}>
            <View style={{ ...theme.inputContainer, marginVertical: 15 }}>
                <ScrollView>
                    <Input
                        label="Lower Limit:"
                        placeholder="0"
                        keyboardType='decimal-pad'
                        value={`${grid.lowerLimit}`}
                        onChangeText={value => onGridChange({ name: 'lowerLimit', value })} />

                    <Input
                        label="Upper Limit:"
                        placeholder="0"
                        keyboardType='decimal-pad'
                        value={`${grid.upperLimit}`}
                        onChangeText={value => onGridChange({ name: 'upperLimit', value })} />

                    <Input
                        label="Levels:"
                        placeholder="3"
                        disabled={automation.id > 0}
                        keyboardType='numeric'
                        value={`${grid.levels}`}
                        onChangeText={value => onGridChange({ name: 'levels', value })} />

                    <QuantityInput
                        value={grid.quantity}
                        onChange={value => onGridChange({ name: 'quantity', value })} />

                    <View style={styles.row}>
                        <SwitchInput
                            text="Is Active?"
                            onChange={value => onAutomationChange({ name: 'isActive', value })}
                            isChecked={automation.isActive} />

                        <SwitchInput
                            text="Enable logs?"
                            onChange={value => onAutomationChange({ name: 'logs', value })}
                            isChecked={automation.logs} />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5
    }
})

export default GeneralArea;