import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useTheme } from 'react-native-elements';
import Block from '../Block/Block';
import { getSymbol } from '../../services/SymbolsService';
import { getMemoryIndex } from '../../services/BeholderService';

/**
 * props:
 * - symbol
 * - isFuture
 * - header?
 * - style?
 * - onLoad?
 */
function WalletSummary(props) {
    console.log(props?.symbol, "system symbol");

    const { theme } = useTheme();

    const [base, setBase] = useState({});
    const [quote, setQuote] = useState({});

    async function loadWallet(symbol, isFuture = false) {
        const symbolObj = await getSymbol(symbol);
        // console.log(symbolObj?.base, "loadWallet111");
        const base = await getMemoryIndex(symbolObj?.base, isFuture ? 'FWALLET' : 'WALLET');
        setBase({ coin: symbolObj?.base, qty: base });

        const quote = await getMemoryIndex(symbolObj?.quote, isFuture ? 'FWALLET' : 'WALLET');
        setQuote({ coin: symbolObj?.quote, qty: quote });

        if (props.onLoad) {
            props.onLoad({ ...symbolObj, baseQty: base, quoteQty: quote });
        }
    }

    useEffect(() => {
        if (!props.symbol) return;
        loadWallet(props.symbol, props.isFuture);
    }, [props.symbol, props.isFuture])

    function getCoin(coinObj) {
        if (coinObj)
            return (coinObj.coin + ": " + (coinObj.qty > 0 ? coinObj.qty : 0)).substring(0, 15);
        return <ActivityIndicator />;
    }

    return (
        <View style={{ alignItems: 'center', ...props.style }}>
            {
                props.header === false
                    ? <></>
                    : (
                        <Text style={theme.h2}>
                            <Icon name="dollar-sign" size={20} color="black" />
                            You Have:
                            <Icon name="dollar-sign" size={20} color="black" />
                        </Text>
                    )
            }
            <View style={styles.row}>
                <Block color={theme.colors.success}>
                    <Text style={styles.coin}>{getCoin(base)}</Text>
                </Block>
                <Block color={theme.colors.info}>
                    <Text style={styles.coin}>{getCoin(quote)}</Text>
                </Block>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginTop: 10
    },
    coin: {
        fontWeight: 'bold',
        color: '#fff'
    }
})

export default WalletSummary;