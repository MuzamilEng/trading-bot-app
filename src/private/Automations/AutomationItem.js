import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme, ListItem, Avatar } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import { startAutomation, stopAutomation, deleteAutomation } from '../../services/AutomationsService';

/**
 * props:
 * - automation
 * - onPress
 * - onRefresh
 */
function AutomationItem(props) {

    const { theme } = useTheme();

    const [expanded, setExpanded] = useState(false);

    function getColorByStatus(automation) {
        if (!automation.isActive) return theme.colors.danger;
        if (automation.isActive && automation.schedule) return theme.colors.info;
        return theme.colors.success;
    }

    function getIcon(automation) {
        const icon = { color: 'white', type: 'feather' };
        if (automation.schedule) return { ...icon, name: 'calendar' };
        if (automation.grids && automation.grids.length) return { ...icon, name: 'grid' };
        return { ...icon, name: 'command' };
    }

    function getAvatar(automation) {
        return <Avatar
            rounded
            size="small"
            icon={getIcon(automation)}
            overlayContainerStyle={{ backgroundColor: getColorByStatus(automation) }} />
    }

    function onStopPress(automation) {
        stopAutomation(automation.id)
            .then(response => props.onRefresh())
            .catch(err => console.error(err.response ? err.response.data : err.message));
    }

    function onStartPress(automation) {
        startAutomation(automation.id)
            .then(response => props.onRefresh())
            .catch(err => console.error(err.response ? err.response.data : err.message));
    }

    function onDeletePress(automation) {
        deleteAutomation(automation.id)
            .then(response => props.onRefresh())
            .catch(err => console.error(err.response ? err.response.data : err.message));
    }

    return (
        <ListItem.Accordion
            bottomDivider={true}
            isExpanded={expanded}
            content={
                <>
                    {getAvatar(props.automation)}
                    <ListItem.Content style={styles.content}>
                        <ListItem.Title>{props.automation.name}</ListItem.Title>
                        <View style={styles.subtitleView}>
                            <Text style={styles.subtitle}>
                                {props.automation.symbol}
                            </Text>
                        </View>
                    </ListItem.Content>
                </>
            }
            onPress={evt => setExpanded(!expanded)}>
            {
                <ListItem onPress={evt => props.onPress(evt)} bottomDivider>
                    <Icon name="edit" size={20} color="black" style={styles.icon} />
                    <ListItem.Content>
                        <ListItem.Title>Edit</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            }
            {
                props.automation.isActive
                    ? (
                        <ListItem onPress={evt => onStopPress(props.automation)} bottomDivider>
                            <Icon name="stop-circle" size={20} color="black" style={styles.icon} />
                            <ListItem.Content>
                                <ListItem.Title>Stop</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    )
                    : (
                        <>
                            <ListItem onPress={evt => onStartPress(props.automation)} bottomDivider>
                                <Icon name="play-circle" size={20} color="black" style={styles.icon} />
                                <ListItem.Content>
                                    <ListItem.Title>Start</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem onPress={evt => onDeletePress(props.automation)} bottomDivider>
                                <Icon name="trash" size={20} color="black" style={styles.icon} />
                                <ListItem.Content>
                                    <ListItem.Title>Delete</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        </>
                    )
            }
        </ListItem.Accordion>
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
    },
    content: {
        marginLeft: 10
    },
    icon: {
        paddingLeft: 45
    }
})

export default AutomationItem;