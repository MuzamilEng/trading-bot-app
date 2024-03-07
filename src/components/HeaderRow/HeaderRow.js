import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import SelectSymbol from '../SelectSymbol/SelectSymbol';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - symbol
 * - onBackPress
 * - onSymbolChange
 * - isFuture
 * - hasFutures
 * - onMarketChange
 */
function HeaderRow(props) {

    const [symbol, setSymbol] = useState(props.symbol);

    useEffect(() => {
        setSymbol(props.symbol);
    }, [props.symbol])

    function onSymbolChange(symbol) {
        setSymbol(symbol);
        props.onSymbolChange(symbol);
    }

    return (
        <View style={styles.row}>
            <Icon.Button
                name="chevron-left"
                size={24}
                color="black"
                underlayColor="#ccc"
                backgroundColor="transparent"
                onPress={props.onBackPress} />
            <View style={styles.view}>
                <SelectSymbol
                    symbol={symbol}
                    hasFutures={props.hasFutures}
                    isFuture={props.isFuture}
                    onMarketChange={props.onMarketChange}
                    onSymbolChange={onSymbolChange} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    view: {
        flex: 1,
        alignItems: 'center'
    }
})

export default HeaderRow;