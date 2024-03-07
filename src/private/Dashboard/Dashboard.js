import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SelectSymbol from '../../components/SelectSymbol/SelectSymbol';
import SymbolChart from './SymbolChart';
import WalletSummary from '../../components/WalletSummary/WalletSummary';
import useWebSocket from 'react-use-websocket';
import { REACT_APP_BWS_URL } from '@env';
console.log(REACT_APP_BWS_URL, "React");
import Ticker from './Ticker';
import Book from './Book';
import NewOrderButton from '../../components/NewOrderButton/NewOrderButton';
import { useIsFocused } from '@react-navigation/native';

function Dashboard({ navigation, route }) {

    const isFocused = useIsFocused();

    const [symbol, setSymbol] = useState('BTCUSDT');
    const [data, setData] = useState(null);

    function onSymbolChange(symbol) {
        setSymbol(symbol);
    }

    const cachedComponents = useMemo(() => {
        return (
            <>
                <SelectSymbol symbol={symbol} onSymbolChange={onSymbolChange} />
                <SymbolChart symbol={symbol} />
                <WalletSummary symbol={symbol} />
            </>
        )
    }, [symbol])

    const { lastJsonMessage } = useWebSocket(`${REACT_APP_BWS_URL}/${symbol.toLowerCase()}@ticker`, {
        onOpen: () => { },
        onMessage: () => {
            if (lastJsonMessage && isFocused) {
                setData({
                    priceChange: lastJsonMessage.p,
                    priceChangePercent: lastJsonMessage.P,
                    open: lastJsonMessage.o,
                    high: lastJsonMessage.h,
                    low: lastJsonMessage.l,
                    close: lastJsonMessage.c,
                    bestBid: lastJsonMessage.b,
                    bestAsk: lastJsonMessage.a,
                    numberOfTrades: lastJsonMessage.n,
                    quoteVolume: lastJsonMessage.q,
                    baseVolume: lastJsonMessage.v
                })
            }
        },
        onError: (event) => console.error(event),
        shouldReconnect: () => true,
        reconnectInterval: 3000
    })

    return (
        <>
            <ScrollView>
                {cachedComponents}
                <View style={styles.row}>
                    <Ticker data={data} />
                    <Book data={data} />
                </View>
            </ScrollView>
            <NewOrderButton navigation={navigation} symbol={symbol} />
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 3,
        paddingRight: 3,
        paddingBottom: 10,
        marginTop: 10
    }
})

export default Dashboard;