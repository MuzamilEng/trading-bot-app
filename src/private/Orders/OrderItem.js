import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme, ListItem, Avatar } from 'react-native-elements';
import "intl";
import "intl/locale-data/jsonp/pt-BR";
import { getColorByStatus } from '../../Utils';

/**
 * props:
 * - order
 * - onPress
 */
function OrderItem(props) {

    const { theme } = useTheme();

    function getTitle(order) {
        return order.symbol + " " + order.quantity.substring(0, 10);
    }

    function getDate(order) {
        const date = new Date(order.transactTime);
        const frm = Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(date);
        return <Text style={styles.subtitle}>{order.automationId ? 'Auto at ' : 'Manual at '}{frm}</Text>
    }

    function getPrice(order) {
        if (order.avgPrice <= 0) return (
            <Text style={styles.subtitle}> | Status: {order.status}</Text>
        )

        return <Text style={styles.subtitle}> | Price: {order.avgPrice.substring(0, 10)}</Text>
    }

    return (
        <ListItem bottomDivider onPress={props.onPress}>
            <Avatar
                rounded
                size="small"
                title={props.order.side}
                titleStyle={{ fontSize: 12 }}
                overlayContainerStyle={{ backgroundColor: getColorByStatus(props.order.status, theme) }} />
            <ListItem.Content>
                <ListItem.Title>{getTitle(props.order)}</ListItem.Title>
                <View style={styles.subtitleView}>
                    {getDate(props.order)}
                    {getPrice(props.order)}
                </View>
            </ListItem.Content>
            <ListItem.Chevron />
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

export default OrderItem;