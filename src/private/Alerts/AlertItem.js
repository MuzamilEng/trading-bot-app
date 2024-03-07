import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ListItem, Avatar, useTheme } from 'react-native-elements';
import "intl";
import "intl/locale-data/jsonp/pt-BR";

/**
 * props:
 * - alert
 */
function AlertItem(props) {
    // console.log(props , "propes in alert111111111111111");

    const { theme } = useTheme();

    const [expanded, setExpanded] = useState(false);

    function getAvatar(type) {
        let color = '';
        switch (type) {
            case 'error': color = theme.colors.danger; break;
            case 'success': color = theme.colors.success; break;
            case 'info': color = theme.colors.info; break;
        }

        return <Avatar
            rounded={true}
            size="small"
            icon={{ name: 'bell', type: 'feather', color: 'white' }}
            overlayContainerStyle={{ backgroundColor: color }} />
    }

    function getDate(timestamp) {
        const date = new Date(timestamp);
        const frm = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(date);
        return (
            <View style={styles.subtitleView}>
                <Text style={styles.subtitle}>{"at " + frm}</Text>
            </View>
        )
    }

    return (
        <ListItem.Accordion
            topDivider={true}
            content={
                <>
                    {getAvatar(props.alert.type)}
                    <ListItem.Content style={styles.content}>
                        <ListItem.Title>{props?.alert?.text?.substring(0, 20) + "..."}</ListItem.Title>
                        {getDate(props?.alert?.date)}
                    </ListItem.Content>
                </>
            }
            isExpanded={expanded}
            onPress={evt => setExpanded(!expanded)}>
                <View style={styles.fullView}>
                    <Text>{props?.alert?.text}</Text>
                </View>
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
    fullView: {
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 60,
        backgroundColor: '#fff'
    }
})

export default AlertItem;