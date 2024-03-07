import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, ListItem, Button } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - text
 * - icon
 * - onDelete
 * - style?
 */
function SmartItem(props) {

    const { theme } = useTheme();

    const styles = StyleSheet.create({
        rightButton: {
            minHeight: '100%',
            paddingLeft: 10,
            backgroundColor: theme.colors.danger
        }
    })

    const icon = <Icon name={props.icon} color="black" size={20} />;

    const rightButton = <Button
        title="Delete"
        onPress={props.onDelete}
        icon={<Icon name="trash" color="white" size={20} />}
        buttonStyle={styles.rightButton} />

    return (
        <ListItem.Swipeable
            bottomDivider={true}
            rightContent={rightButton}>
            {icon}
            <ListItem.Content>
                <ListItem.Title style={{ ...props.style }}>{props.text}</ListItem.Title>
            </ListItem.Content>
        </ListItem.Swipeable>
    )
}

export default SmartItem;