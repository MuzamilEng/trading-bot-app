import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme, Avatar, ListItem } from 'react-native-elements';

/**
 * props:
 * - automation
 */
function AutomationItem(props) {

    const { theme } = useTheme();

    function getColor(net) {
        if (net >= 0) return theme.colors.success;
        return theme.colors.danger;
    }

    function getTitle(automation) {
        return automation.name + ` $${automation.net}`.substring(0, 10);
    }

    function getSubtitle(executions) {
        return (
            <View style={styles.subtitleView}>
                <Text style={styles.subtitle}>{executions} executions</Text>
            </View>
        )
    }

    return (
        <ListItem bottomDivider={true}>
            <Avatar rounded={true} size="small" overlayContainerStyle={{ backgroundColor: getColor(props.automation.net) }} />
            <ListItem.Content>
                <ListItem.Title>{getTitle(props.automation)}</ListItem.Title>
                {getSubtitle(props.automation.executions)}
            </ListItem.Content>
        </ListItem>
    )
}

const styles = StyleSheet.create({
    subtitleView: {
        marginTop: 5,
        flexDirection: 'row'
    },
    subtitle: {
        color: 'grey',
        fontSize: 8
    }
})

export default AutomationItem;