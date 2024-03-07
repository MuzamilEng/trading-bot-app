import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { ListItem, Avatar, useTheme } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import { deleteOrderTemplate } from '../../services/OrderTemplatesService';

/**
 * props:
 * - data
 * - onPress
 * - onRefresh
 */
function OrderTemplateItem(props) {

    const { theme } = useTheme();

    const [expanded, setExpanded] = useState(false);

    function getColor(side) {
        return side === 'BUY' ? theme.colors.success : theme.colors.danger;
    }

    function getAvatar(orderTemplate) {
        return <Avatar
            rounded={true}
            size="small"
            title={orderTemplate.side}
            titleStyle={{ fontSize: 12 }}
            overlayContainerStyle={{ backgroundColor: getColor(orderTemplate.side) }} />
    }

    function onDeletePress(orderTemplate) {
        deleteOrderTemplate(orderTemplate.id)
            .then(result => props.onRefresh())
            .catch(err => console.error(err.response ? err.response.data : err.message));
    }

    return (
        <ListItem.Accordion
            bottomDivider={true}
            content={
                <>
                    {getAvatar(props.data)}
                    <ListItem.Content style={styles.content}>
                        <ListItem.Title>{props.data.name}</ListItem.Title>
                        <View style={styles.subtitleView}>
                            <Text style={styles.subtitle}>
                                {props.data.symbol} {props.data.type}
                            </Text>
                        </View>
                    </ListItem.Content>
                </>
            }
            isExpanded={expanded}
            onPress={() => setExpanded(!expanded)}>
            <ListItem bottomDivider={true} onPress={(evt) => props.onPress(evt)}>
                <Icon name="edit" size={20} color="black" style={styles.icon} />
                <ListItem.Content>
                    <ListItem.Title>Edit</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem bottomDivider={true} onPress={(evt) => onDeletePress(props.data)}>
                <Icon name="trash" size={20} color="black" style={styles.icon} />
                <ListItem.Content>
                    <ListItem.Title>Delete</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </ListItem.Accordion>
    )
}

const styles = StyleSheet.create({
    icon: {
        paddingLeft: 45
    },
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
    }
})

export default OrderTemplateItem;