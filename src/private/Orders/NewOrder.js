import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme, Input, Button } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import SelectSymbol from '../../components/SelectSymbol/SelectSymbol';
import CurrentPrice from '../../components/CurrentPrice/CurrentPrice';
import WalletSummary from '../../components/WalletSummary/WalletSummary';
import SelectSide from '../../components/SelectSide/SelectSide';
import SelectType from '../../components/SelectType/SelectType';
import { getMemoryIndex } from '../../services/BeholderService';

import { placeOrder } from '../../services/OrdersService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MarginTypeModal from './MarginTypeModal';
import LeverageModal from './LeverageModal';

function NewOrder({ navigation, route }) {

    const { theme } = useTheme();

    const DEFAULT_ORDER = {
        symbol: '',
        side: 'BUY',
        type: 'MARKET',
        quantity: "0",
        limitPrice: "0",
        stopPrice: "0",
        stopPriceMultiplier: "0"
    }

    const [order, setOrder] = useState(DEFAULT_ORDER);
    const [error, setError] = useState('');
    const [price, setPrice] = useState(0);
    const [symbol, setSymbol] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isFuture, setIsFuture] = useState(false);
    const [hasFutures, setHasFutures] = useState(false);
    const [position, setPosition] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem("hasFutures")
            .then(value => {
                setHasFutures(value === "true");
                setIsFuture(route.params.isFuture ? true : false);
                setOrder({ ...DEFAULT_ORDER, symbol: route.params.symbol || 'BTCUSDT' });
                setError('');
                setPrice(0);
            })
    }, [route.params])

    useEffect(() => {
        if (!order.symbol) return;

        if (!isFuture)
            setPosition(null);
        else
            getMemoryIndex(order.symbol, 'POSITION')
                .then(position => setPosition(position))
                .catch(err => setError(err.response ? err.response.data : err.message))
    }, [order.symbol, isFuture])

    function getTotal() {

        const quantity = order.quantity ? parseFloat(order.quantity.replace(',', '.')) : 0;

        const limitPrice = order.limitPrice ? parseFloat(order.limitPrice.replace(',', '.')) : 0;

        const callbackRate = order.stopPriceMultiplier ? parseFloat(order.stopPriceMultiplier) : 0;

        if (order.type.indexOf('TRAILING_STOP') !== -1 && callbackRate && quantity && limitPrice) {
            const percentage = callbackRate / 100;
            const multiplier = order.side === 'BUY' ? 1 + percentage : 1 - percentage;
            return `${quantity * limitPrice * multiplier}`.substring(0, 10);
        }

        if (order.type.indexOf('MARKET') !== -1 && quantity && price)
            return `${quantity * price}`.substring(0, 10);

        const isLimitSpot = ['LIMIT', 'TAKE_PROFIT_LIMIT', 'STOP_LOSS_LIMIT'].includes(order.type);
        const isLimitFutures = ['LIMIT', 'TAKE_PROFIT', 'STOP'].includes(order.type);
        if ((isLimitSpot || isLimitFutures) && quantity && limitPrice)
            return `${quantity * limitPrice}`.substring(0, 10);

        return "0";
    }

    function doPlaceOrder() {

        const total = parseFloat(getTotal());
        if (total < (isFuture ? symbol.fMinNotional : symbol.minNotional))
            return setError(`Min Notional: ${isFuture ? symbol.fMinNotional : symbol.minNotional}`);

        const quantity = parseFloat(order.quantity);
        if (order.side === 'SELL' && symbol.baseQty < quantity)
            return setError(`You haven't enough ${symbol.base} to sell.`);

        if (order.side === 'BUY' && symbol.quoteQty < total)
            return setError(`You haven't enough ${symbol.quote} to buy.`);

        setIsLoading(true);
        placeOrder(order, isFuture)
            .then(result => {
                setIsLoading(false);
                navigation.navigate('OrdersList', { symbol: order.symbol, isFuture });
            })
            .catch(err => {
                setIsLoading(false);
                setError(err.response ? err.response.data : err.message);
            })
    }

    function onMarketChange(isFuture) {
        setIsFuture(isFuture);
    }

    function showLimitPrice(type) {
        return (isFuture && ['LIMIT', 'STOP', 'TAKE_PROFIT'].includes(type))
            || (!isFuture && ['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'].includes(type));
    }

    return (
        <>
            <View style={theme.page}>
                <View style={styles.header}>
                    <View style={styles.row}>
                        <Icon.Button
                            name="chevron-left"
                            size={24}
                            color="black"
                            backgroundColor="transparent"
                            onPress={() => navigation.navigate("OrdersList", { symbol: order.symbol })} />
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <SelectSymbol
                                hasFutures={hasFutures}
                                isFuture={isFuture}
                                symbol={order.symbol}
                                onSymbolChange={symbol => setOrder({ ...DEFAULT_ORDER, symbol })}
                                onMarketChange={onMarketChange} />
                        </View>
                    </View>
                    <CurrentPrice symbol={order.symbol} onChange={price => setPrice(price)} />
                    <WalletSummary
                        symbol={order.symbol}
                        isFuture={isFuture}
                        style={{ paddingHorizontal: 20 }}
                        header={false}
                        onLoad={obj => setSymbol(obj)} />
                </View>
                <View style={theme.container}>
                    <View style={{ ...theme.inputContainer, marginTop: 10, paddingTop: 10 }}>
                        <ScrollView>
                            <SelectSide isFuture={isFuture} side={order.side} onChange={side => setOrder({ ...order, side })} />
                            <SelectType isFuture={isFuture} type={order?.type} onChange={type => setOrder({ ...order, type })} />
                            {
                                position
                                    ? (
                                        <>
                                            <MarginTypeModal symbol={order.symbol} type={position.marginType} />
                                            <LeverageModal symbol={order.symbol} leverage={position.leverage} />
                                        </>
                                    )
                                    : <></>
                            }
                            {
                                showLimitPrice(order.type)
                                    ? (
                                        <Input
                                            label="Limit Price:"
                                            keyboardType='decimal-pad'
                                            onChangeText={value => setOrder({ ...order, limitPrice: value.replace(',', '.') })}
                                            value={order.limitPrice} />
                                    )
                                    : <></>
                            }
                            {
                                ['STOP', 'TAKE_PROFIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'].includes(order.type)
                                    ? (
                                        <Input
                                            label="Stop Price:"
                                            keyboardType='decimal-pad'
                                            onChangeText={value => setOrder({ ...order, stopPrice: value.replace(',', '.') })}
                                            value={order.stopPrice} />
                                    )
                                    : <></>
                            }
                            {
                                ['TRAILING_STOP', 'TRAILING_STOP_MARKET'].includes(order.type)
                                    ? (
                                        <>
                                            <Input
                                                label="Activation Price:"
                                                keyboardType='decimal-pad'
                                                onChangeText={value => setOrder({ ...order, limitPrice: value.replace(',', '.') })}
                                                value={order.limitPrice} />
                                            <Input
                                                label="Callback Rate (%):"
                                                keyboardType='decimal-pad'
                                                rightIcon={<Icon name="percent" size={16} color="grey" />}
                                                onChangeText={value => setOrder({ ...order, stopPriceMultiplier: value.replace(',', '.') })}
                                                value={order.stopPriceMultiplier} />
                                        </>
                                    )
                                    : <></>
                            }
                            <Input
                                label="Quantity:"
                                keyboardType='decimal-pad'
                                onChangeText={value => setOrder({ ...order, quantity: value.replace(',', '.') })}
                                value={order.quantity} />
                            <View style={styles.totalView}>
                                <Text style={styles.totalTitle}>Total Price:</Text>
                                <Text style={styles.total}>{getTotal()}</Text>
                            </View>
                        </ScrollView>
                        <View style={styles.button}>
                            <Button
                                title={isLoading ? <ActivityIndicator /> : " Place Order"}
                                icon={() => <Icon name="dollar-sign" size={20} color="white" />}
                                onPress={evt => doPlaceOrder()} />
                            {
                                error
                                    ? <Text style={{ ...theme.alert, marginHorizontal: 0 }}>{error}</Text>
                                    : <></>
                            }
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        flex: 0,
        height: 130,
        backgroundColor: '#ccc'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalView: {
        marginLeft: 12,
        paddingBottom: 10
    },
    totalTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'grey'
    },
    total: {
        marginTop: 10,
        fontSize: 18
    },
    button: {
        marginTop: 10,
        paddingHorizontal: 10
    }
})

export default NewOrder;