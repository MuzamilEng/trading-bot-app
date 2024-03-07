import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Input, useTheme } from 'react-native-elements';
import SwitchInput from '../../../components/SwitchInput/SwitchInput';
import ScheduleInput from './ScheduleInput';

/**
 * props:
 * - automation
 * - onChange
 * - type
 */
function GeneralArea(props) {

    const { theme } = useTheme();

    const [automation, setAutomation] = useState({});

    useEffect(() => {
        setAutomation(props.automation);
    }, [props.automation])

    function onChange(newProp) {
        const newData = { ...automation, [newProp.name]: newProp.value };
        setAutomation(newData);
        props.onChange(newProp);
    }

    return (
        <View style={theme.container}>
            <View style={{ ...theme.inputContainer, marginVertical: 15 }}>
                <ScrollView>
                    <Input
                        label="Name:"
                        placeholder="Automation Name"
                        keyboardType='default'
                        autoCapitalize='words'
                        value={automation.name}
                        onChangeText={value => onChange({ name: 'name', value })} />
                    {
                        props.type === 'scheduled' || automation.schedule
                            ? <ScheduleInput schedule={automation.schedule} onChange={value => onChange({ name: 'schedule', value })} />
                            : <></>
                    }
                    <View style={styles.row}>
                        <SwitchInput
                            text="Is Active?"
                            onChange={value => onChange({ name: 'isActive', value })}
                            isChecked={automation.isActive} />

                        <SwitchInput
                            text="Enable logs?"
                            onChange={value => onChange({ name: 'logs', value })}
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