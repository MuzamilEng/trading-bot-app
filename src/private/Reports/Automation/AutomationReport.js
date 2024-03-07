import React, { useState, useEffect } from 'react';
import { useTheme } from 'react-native-elements';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AutomationItem from './AutomationItem';

/**
 * props:
 * - data
 */
function AutomationReport(props) {

    const { theme } = useTheme();

    const [automations, setAutomations] = useState([]);

    useEffect(() => {
        if (!props.data) return;
        setAutomations(props.data);
    }, [props.data])

    return (
        <View style={{ ...theme.inputContainer, ...styles.automations }}>
            <Text style={theme.h2}>Automations</Text>
            <ScrollView>
                {
                    automations.map(automation => (<AutomationItem key={automation.name} automation={automation} />))
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    automations: {
        marginTop: 10,
        marginBottom: 10,
        width: '95%'
    }
})

export default AutomationReport;