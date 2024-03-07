import React, { useState, useEffect } from 'react';
import { FAB } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - navigation
 * - symbol
 * - isFuture
 */
function NewOrderButton(props) {

    const [symbol, setSymbol] = useState('BTCUSDT');
    const [isFuture, setIsFuture] = useState(false);

    useEffect(() => {
        setSymbol(props.symbol || 'BTCUSDT');
    }, [props.symbol])

    useEffect(() => {
        setIsFuture(props.isFuture ? true : false);
    }, [props.isFuture])

    function onPress() {
        props.navigation.navigate('Orders', { screen: 'NewOrder', params: { symbol, isFuture } });
    }

    return (
        <FAB title={<Icon name="dollar-sign" size={20} color="white" />} placement='right' onPress={onPress} />
    )
}

export default NewOrderButton;