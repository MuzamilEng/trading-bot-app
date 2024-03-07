import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-elements';
import ActionBuilder from './ActionBuilder';
import SmartItem from '../../../../components/SmartItem/SmartItem';

/**
 * props:
 * - actions
 * - symbol
 * - onChange
 * - type
 */
function ActionsArea(props) {

    const { theme } = useTheme();

    const [actions, setActions] = useState([]);
    const [symbol, setSymbol] = useState('');

    useEffect(() => {
        setActions(props.actions || []);
    }, [props.actions])

    useEffect(() => {
        setSymbol(props.symbol);
    }, [props.symbol])

    function onDeleteAction(id) {
        const index = actions.findIndex(a => a.id === id);
        actions.splice(index, 1);
        setActions(actions);
        props.onChange(actions);
    }

    function getText(action) {
        switch (action.type) {
            case 'ALERT_EMAIL': return 'Send E-mail';
            case 'ALERT_SMS': return 'Send SMS';
            case 'ALERT_TELEGRAM': return 'Send Telegram';
            case 'ORDER': return action.orderTemplate.name;
            case 'TRAILING': return action.orderTemplate.name;
            case 'WITHDRAW': return action.withdrawTemplate.name;
        }
    }

    function getIcon(type) {
        switch (type) {
            case 'ALERT_EMAIL': return 'mail';
            case 'ALERT_SMS': return 'smartphone';
            case 'ALERT_TELEGRAM': return 'message-square';
            case 'ORDER': return 'shopping-cart';
            case 'TRAILING': return 'trending-up';
            case 'WITHDRAW': return 'dollar-sign';
        }
    }

    function onAddAction(action) {
        if (actions.some(a => a.id === action.id)) return;

        actions.push(action);
        setActions(actions);
        props.onChange(actions);
    }

    return (
        <View style={theme.container}>
            <ActionBuilder symbol={symbol} onAddAction={onAddAction} />
            <View style={styles.list}>
                <ScrollView>
                    {
                        actions && actions.length
                            ? actions.map(action => (
                                <SmartItem
                                    key={action.id}
                                    onDelete={evt => onDeleteAction(action.id)}
                                    text={getText(action)}
                                    icon={getIcon(action.type)} />
                            ))
                            : <></>
                    }
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
        paddingHorizontal: 20,
        flex: 1
    }
})

export default ActionsArea;