import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FAB, Overlay, ListItem, Avatar, useTheme } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - navigation
 */
function NewAutomationButton(props) {

    const { theme } = useTheme();

    const [showModal, setShowModal] = useState(false);

    function onPress(type) {
        setShowModal(false);
        if (type === 'grid') return props.navigation.navigate('Automations', { screen: 'NewGrid', params: { type } });
        return props.navigation.navigate('Automations', { screen: 'NewAutomation', params: { type } });
    }

    function getIcon(type) {
        const icon = { color: "white", type: "feather" };
        if (type === 'scheduled') return { ...icon, name: 'calendar' };
        if (type === 'grid') return { ...icon, name: 'grid' };
        return { ...icon, name: 'command' };
    }

    function getItem(type, title, last = false) {
        return (
            <ListItem key={type} onPress={() => onPress(type)} bottomDivider={!last}>
                <Avatar rounded size="small" icon={getIcon(type)} overlayContainerStyle={{ backgroundColor: theme.colors.secondary }} />
                <ListItem.Content>
                    <ListItem.Title>{title}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        )
    }

    return (
        <>
            <FAB title={<Icon name="plus" size={20} color="white" />} placement='right' onPress={evt => setShowModal(!showModal)} />
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={showModal}
                onBackdropPress={evt => setShowModal(false)}>
                <View>
                    <Text style={{ ...theme.h2, alignSelf: 'center' }}>Choose one:</Text>
                    {getItem('regular', 'Regular Automation')}
                    {getItem('grid', 'Grid Automation')}
                    {getItem('scheduled', 'Scheduled Automation', true)}
                </View>
            </Overlay>
        </>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 0,
        width: '90%'
    }
})

export default NewAutomationButton;