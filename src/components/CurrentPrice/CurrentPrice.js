import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-elements';
import useWebSocket from 'react-use-websocket';
import Block from '../Block/Block';
import { Feather as Icon } from '@expo/vector-icons';

import { REACT_APP_BWS_URL } from '@env';

/**
 * props:
 * - symbol
 * - onChange?
 */
function CurrentPrice(props) {

    const { theme } = useTheme();

    const [symbol, setSymbol] = useState('btcusdt');
    const [data, setData] = useState({});

    useEffect(() => {
        if (!props.symbol) return;
        setSymbol(props.symbol.toLowerCase());
    }, [props.symbol])

    const { lastJsonMessage } = useWebSocket(`${REACT_APP_BWS_URL}/${symbol}@ticker`, {
        onOpen: () => { },
        onError: (err) => console.error(err),
        shouldReconnect: () => true,
        reconnectInterval: 3000,
        onMessage: () => {
            if (lastJsonMessage) {
                setData({
                    price: lastJsonMessage.c,
                    priceChangePercent: parseFloat(lastJsonMessage.P)
                })

                if (props.onChange)
                    props.onChange(parseFloat(lastJsonMessage.c));
            }
        }
    })

    function getArrow(priceChange) {
        return priceChange > 0
            ? <Icon name="arrow-up" color="green" size={12} style={styles.icon} />
            : <Icon name="arrow-down" color="red" size={12} style={styles.icon} />;
    }

    function getPrice(price, priceChange) {
        return price
            ? (
                <>
                    {price.substring(0, 10)} {getArrow(priceChange)}
                </>
            )
            : <ActivityIndicator />;
    }

    return (
        <Block color={theme.colors.warning} style={styles.block}>
            <Text style={styles.text}>Current Price: {getPrice(data.price, data.priceChangePercent)}</Text>
        </Block>
    )
}

const styles = StyleSheet.create({
    block: {
        marginHorizontal: 24,
        alignItems: 'center',
        flex: 0
    },
    text: {
        fontWeight: 'bold',
        color: 'white'
    },
    icon: {
        marginLeft: 5
    }
})

export default CurrentPrice;