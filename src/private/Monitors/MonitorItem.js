import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme, ListItem, Avatar } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import { stopMonitor, startMonitor, deleteMonitor } from '../../services/MonitorsService';

/**
 * props:
 * - monitor
 * - onPress
 * - onRefresh
 */
function MonitorItem(props) {

    const { theme } = useTheme();
    const [expanded, setExpanded] = useState(false);

    function getIcon(type) {
        const icon = { color: 'white', type: 'feather' };
        switch (type) {
            case 'CANDLES': return { ...icon, name: 'bar-chart-2' };
            case 'TICKER': return { ...icon, name: 'clock' };
            case 'MINI_TICKER': return { ...icon, name: 'activity' };
            case 'BOOK': return { ...icon, name: 'book-open' };
            case 'USER_DATA': return { ...icon, name: 'user' };
        }
    }

    function getStatus(monitor) {
        if (!monitor.isActive) return theme.colors.danger;
        return theme.colors.success;
    }

    function getAvatar() {
        return <Avatar
            rounded={true}
            size="small"
            icon={getIcon(props.monitor.type)}
            overlayContainerStyle={{ backgroundColor: getStatus(props.monitor) }} />
    }

    function onStopPress(monitor) {
        stopMonitor(monitor.id)
            .then(result => props.onRefresh())
            .catch(err => console.error(err.response ? err.response.data : err.message))
    }

    function onStartPress(monitor) {
        startMonitor(monitor.id)
            .then(result => props.onRefresh())
            .catch(err => console.error(err.response ? err.response.data : err.message))
    }

    function onDeletePress(monitor) {
        deleteMonitor(monitor.id)
            .then(result => props.onRefresh())
            .catch(err => console.error(err.response ? err.response.data : err.message))
    }

    return (
        <ListItem.Accordion
            bottomDivider={true}
            content={
                <>
                    {getAvatar()}
                    <ListItem.Content style={styles.content}>
                        <ListItem.Title>{props.monitor.symbol} {props.monitor.interval}</ListItem.Title>
                        <View style={styles.subtitleView}>
                            <Text style={styles.subtitle}>{props.monitor.indexes}</Text>
                        </View>
                    </ListItem.Content>
                </>
            }
            isExpanded={expanded}
            onPress={evt => setExpanded(!expanded)}>
            <ListItem onPress={evt => props.onPress(evt)} bottomDivider={true}>
                <Icon style={styles.icon} name="edit" size={20} color="black" />
                <ListItem.Content>
                    <ListItem.Title>Edit</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            {
                props.monitor.isActive
                    ? (
                        <ListItem onPress={evt => onStopPress(props.monitor)} bottomDivider={true}>
                            <Icon style={styles.icon} name="stop-circle" size={20} color="black" />
                            <ListItem.Content>
                                <ListItem.Title>Stop</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    )
                    : (
                        <>
                            <ListItem onPress={evt => onStartPress(props.monitor)} bottomDivider={true}>
                                <Icon style={styles.icon} name="play-circle" size={20} color="black" />
                                <ListItem.Content>
                                    <ListItem.Title>Start</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem onPress={evt => onDeletePress(props.monitor)} bottomDivider={true}>
                                <Icon style={styles.icon} name="trash" size={20} color="black" />
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
    content: {
        marginLeft: 10
    },
    subtitleView: {
        marginTop: 5,
        flexDirection: 'row'
    },
    subtitle: {
        color: 'grey',
        fontSize: 8
    },
    icon: {
        paddingLeft: 45
    }
})

export default MonitorItem;