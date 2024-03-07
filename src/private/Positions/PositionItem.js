import { View, Text, StyleSheet } from 'react-native';
import { ListItem, Avatar, useTheme } from 'react-native-elements';
import "intl";
import "intl/locale-data/jsonp/pt-BR";

/**
 * props:
 * - position
 * - onPress
 */
function PositionItem(props) {

    const { theme } = useTheme();

    function getColor(positionSide) {
        switch (positionSide) {
            case 'LONG': return theme.colors.success;
            case 'SHORT': return theme.colors.danger;
            default: return theme.colors.warning;
        }
    }

    function getTitle(position) {
        if (!position) return "";
        return position.symbol + " " + position.positionAmt.substring(0, 10);
    }

    function getDescription(position) {
        const date = new Date(parseInt(position.updateTime));
        const frm = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(date);
        return (
            <Text style={styles.subtitle}>
                {`${position.marginType.toUpperCase()} ${position.leverage}x at ${frm}`}
            </Text>
        )
    }

    function getProfit(position) {
        if (!position.unRealizedProfit) return <></>;
        return (
            <Text style={styles.subtitle}>
                | Profit: {position.unRealizedProfit.substring(0, 10)}
            </Text>
        )
    }

    return (
        <ListItem bottomDivider onPress={props.onPress}>
            <Avatar
                rounded
                size="small"
                title={props.position.positionSide}
                titleStyle={{ fontSize: 12 }}
                overlayContainerStyle={{ backgroundColor: getColor(props.position.positionSide) }} />
            <ListItem.Content>
                <ListItem.Title>{getTitle(props.position)}</ListItem.Title>
                <View style={styles.subtitleView}>
                    {getDescription(props.position)}
                    {getProfit(props.position)}
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

export default PositionItem;