import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme, Input, Button } from 'react-native-elements';
import HeaderRow from '../../components/HeaderRow/HeaderRow';
import SelectSide from '../../components/SelectSide/SelectSide';
import SelectType from '../../components/SelectType/SelectType';
import { Feather as Icon } from '@expo/vector-icons';
import { saveOrderTemplate, getOrderTemplate } from '../../services/OrderTemplatesService';
import MultiplierInput from '../../components/MultiplierInput/MultiplierInput';
import { getMonitorsBySymbol } from '../../services/MonitorsService';
import MarginType from '../../components/MarginType/MarginType';
import LeverageInput from '../../components/LeverageInput/LeverageInput';
import SwitchInput from '../../components/SwitchInput/SwitchInput';

function NewOrderTemplate({ navigation, route }) {

    const { theme } = useTheme();

    const DEFAULT_ORDER_TEMPLATE = {
        symbol: 'BTCUSDT',
        type: 'MARKET',
        side: 'BUY',
        name: '',
        quantity: '',
        quantityMultiplier: 1,
        limitPrice: '',
        limitPriceMultiplier: 1,
        stopPrice: '',
        stopPriceMultiplier: 1,
        reduceOnly: null,
        marginType: null,
        leverage: "0"
    }

    const [orderTemplate, setOrderTemplate] = useState(DEFAULT_ORDER_TEMPLATE);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasFutures, setHasFutures] = useState(false);
    const [isFuture, setIsFuture] = useState(false);

    const DEFAULT_SPOT_PRICE_OPTIONS = [
        { label: 'Book Ask Price', value: 'BOOK_ASK' },
        { label: 'Book Bid Price', value: 'BOOK_BID' },
        { label: 'Last Order Avg. Price', value: 'LAST_ORDER_AVG' },
        { label: 'Last Order Limit Price', value: 'LAST_ORDER_LIMIT' },
        { label: 'Last Order Stop Price', value: 'LAST_ORDER_STOP' }
    ]

    const DEFAULT_FUTURES_PRICE_OPTIONS = [
        { label: 'Book Ask Price', value: 'BOOK_ASK' },
        { label: 'Book Bid Price', value: 'BOOK_BID' },
        { label: 'Index Price', value: 'INDEX_PRICE' },
        { label: 'Last Order Avg. Price', value: 'FLAST_ORDER_AVG' },
        { label: 'Last Order Limit Price', value: 'FLAST_ORDER_LIMIT' },
        { label: 'Last Order Stop Price', value: 'FLAST_ORDER_STOP' },
        { label: 'Last Liquidation Price', value: 'LAST_LIQ_PRICE' },
        { label: 'Mark Price', value: 'MARK_PRICE' },
        { label: 'Position Entry Price', value: 'POSITION_ENTRY' },
        { label: 'Position Liquidation Price', value: 'POSITION_LIQ_PRICE' }
    ]

    const [priceOptions, setPriceOptions] = useState(DEFAULT_SPOT_PRICE_OPTIONS);

    useEffect(() => {
        if (!orderTemplate.symbol) return;
        getMonitorsBySymbol(orderTemplate.symbol)
            .then(monitors => {
                const intervalOptions = monitors.filter(m => !m.isSystemMon && m.isActive && m.type === 'CANDLES' && m.interval).map(m => {
                    return [{
                        label: `Last Candle ${m.interval} Open`, value: `LAST_CANDLE_${m.interval}_OPEN`
                    }, {
                        label: `Last Candle ${m.interval} High`, value: `LAST_CANDLE_${m.interval}_HIGH`
                    }, {
                        label: `Last Candle ${m.interval} Low`, value: `LAST_CANDLE_${m.interval}_LOW`
                    }, {
                        label: `Last Candle ${m.interval} Close`, value: `LAST_CANDLE_${m.interval}_CLOSE`
                    }]
                }) || [];

                if (isFuture)
                    setPriceOptions([...DEFAULT_FUTURES_PRICE_OPTIONS, ...intervalOptions.flat()])
                else
                    setPriceOptions([...DEFAULT_SPOT_PRICE_OPTIONS, ...intervalOptions.flat()])
            })
            .catch(err => setError(err.response ? err.response.data : err.message));
    }, [orderTemplate.symbol, isFuture])

    useEffect(() => {
        setIsLoading(true);
        setError('');
        setHasFutures(route.params.hasFutures ? true : false);
        setIsFuture(route.params.isFuture ? true : false);

        if (route.params.data && route.params.data.id) {
            getOrderTemplate(route.params.data.id)
                .then(result => {
                    setIsLoading(false);
                    setOrderTemplate(result)
                })
                .catch(err => {
                    setIsLoading(false);
                    setError(err.response ? err.response.data : err.message)
                })
        }
        else
            setOrderTemplate({ ...DEFAULT_ORDER_TEMPLATE });
    }, [route.params])

    function onPress(event) {
        setError('');

        setIsLoading(true);
        saveOrderTemplate(orderTemplate.id, orderTemplate)
            .then(result => {
                setIsLoading(false);
                navigation.navigate("Order Templates", { screen: 'OrderTemplatesList', params: { orderTemplate: result, isFuture, symbol: result.symbol } });
            })
            .catch(err => {
                setIsLoading(false);
                setError(err.response ? err.response.data : err.message);
            })
    }

    function onMarketChange(isFuture) {
        setIsFuture(isFuture);
        setOrderTemplate({ ...DEFAULT_ORDER_TEMPLATE });
    }

    function showLimitPriceField(type, isFuture) {
        return (isFuture && ['LIMIT', 'STOP', 'TAKE_PROFIT'].includes(type))
            || (!isFuture && ['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'].includes(type))
    }

    function showStopPriceField(type, isFuture) {
        return isFuture
            ? ['STOP', 'TAKE_PROFIT', 'STOP_MARKET', 'TAKE_PROFIT_MARKET'].includes(type)
            : ['STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'].includes(type);
    }

    function getQuantityOptions() {
        return isFuture
            ? [
                { label: 'Last Order Qty.', value: 'LAST_ORDER_QTY' },
                { label: 'Min. Notional', value: 'MIN_NOTIONAL' },
                { label: 'Position Amount', value: 'POSITION_AMT' },
            ]
            : [
                { label: 'Last Order Qty.', value: 'LAST_ORDER_QTY' },
                { label: 'Max. Wallet', value: 'MAX_WALLET' },
                { label: 'Min. Notional', value: 'MIN_NOTIONAL' },
                { label: 'Quote Quantity', value: 'QUOTE_QTY' }
            ]
    }

    return (
        <>
            <View style={theme.page}>
                <View style={styles.header}>
                    <HeaderRow
                        symbol={orderTemplate.symbol}
                        hasFutures={hasFutures}
                        isFuture={isFuture}
                        onBackPress={() => navigation.navigate("OrderTemplatesList", { isFuture, symbol: orderTemplate.symbol })}
                        onSymbolChange={symbol => setOrderTemplate({ ...orderTemplate, symbol })}
                        onMarketChange={onMarketChange} />
                </View>
                <View style={theme.container}>
                    <View style={{ ...theme.inputContainer, marginTop: 20, paddingTop: 20 }}>
                        <ScrollView>
                            <Input
                                label="Name:"
                                keyboardType='name-phone-pad'
                                onChangeText={name => setOrderTemplate({ ...orderTemplate, name })}
                                value={orderTemplate.name} />
                            <Text style={styles.label}>Side: </Text>
                            <SelectSide
                                side={orderTemplate.side}
                                isFuture={isFuture}
                                onChange={side => setOrderTemplate({ ...orderTemplate, side })} />
                            <Text style={styles.label}>Type: </Text>
                            <SelectType
                                type={orderTemplate.type}
                                isFuture={isFuture}
                                onChange={type => setOrderTemplate({ ...orderTemplate, type })} />
                            {
                                isFuture
                                    ? (
                                        <>
                                            <Text style={styles.label}>Margin: </Text>
                                            <MarginType
                                                type={orderTemplate?.marginType || 'ISOLATED'}
                                                onChange={marginType => setOrderTemplate({ ...orderTemplate, marginType })} />
                                            <Text style={styles.label}>Leverage: </Text>
                                            <LeverageInput
                                                leverage={orderTemplate.leverage || '0'}
                                                onChange={leverage => setOrderTemplate({ ...orderTemplate, leverage })} />
                                            <View style={{ marginLeft: 10, marginBottom: 20 }}>
                                                <SwitchInput
                                                    text="Reduce Only?"
                                                    onChange={reduceOnly => setOrderTemplate({ ...orderTemplate, reduceOnly })}
                                                    isChecked={orderTemplate.reduceOnly || false} />
                                            </View>
                                        </>
                                    )
                                    : <></>
                            }
                            {
                                showLimitPriceField(orderTemplate.type, isFuture)
                                    ? <MultiplierInput
                                        label="Limit Price: "
                                        onChange={obj => setOrderTemplate({
                                            ...orderTemplate,
                                            limitPrice: obj.value,
                                            limitPriceMultiplier: obj.valueMultiplier
                                        })}
                                        value={orderTemplate.limitPrice}
                                        valueMultiplier={orderTemplate.limitPriceMultiplier}
                                        options={priceOptions} />
                                    : <></>
                            }
                            {
                                showStopPriceField(orderTemplate.type, isFuture)
                                    ? <MultiplierInput
                                        label="Stop Price: "
                                        onChange={obj => setOrderTemplate({
                                            ...orderTemplate,
                                            stopPrice: obj.value,
                                            stopPriceMultiplier: obj.valueMultiplier
                                        })}
                                        value={orderTemplate.stopPrice}
                                        valueMultiplier={orderTemplate.stopPriceMultiplier}
                                        options={priceOptions} />
                                    : <></>
                            }
                            {
                                ['TRAILING_STOP', 'TRAILING_STOP_MARKET'].includes(orderTemplate.type)
                                    ? (
                                        <>
                                            <MultiplierInput
                                                label="Activation Price: "
                                                onChange={obj => setOrderTemplate({
                                                    ...orderTemplate,
                                                    limitPrice: obj.value,
                                                    limitPriceMultiplier: obj.valueMultiplier
                                                })}
                                                value={orderTemplate.limitPrice}
                                                valueMultiplier={orderTemplate.limitPriceMultiplier}
                                                options={priceOptions} />
                                            <Input
                                                label="Callback Rate (%): "
                                                keyboardType='decimal-pad'
                                                rightIcon={<Icon name="percent" size={16} color="grey" />}
                                                onChangeText={value => setOrderTemplate({ ...orderTemplate, stopPriceMultiplier: value.replace(',', '.') })}
                                                value={`${orderTemplate.stopPriceMultiplier}`} />
                                        </>
                                    )
                                    : <></>
                            }
                            <MultiplierInput
                                label="Quantity: "
                                onChange={obj => setOrderTemplate({
                                    ...orderTemplate,
                                    quantity: obj.value,
                                    quantityMultiplier: obj.valueMultiplier
                                })}
                                value={orderTemplate.quantity}
                                valueMultiplier={orderTemplate.quantityMultiplier}
                                options={getQuantityOptions()} />
                        </ScrollView>
                        <View style={styles.button}>
                            <Button
                                title={isLoading ? <ActivityIndicator /> : " Save Order Template"}
                                icon={() => <Icon name="save" size={20} color="white" />}
                                onPress={onPress} />
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
        height: 50,
        backgroundColor: '#ccc'
    },
    label: {
        fontWeight: 'bold',
        color: 'grey',
        paddingLeft: 10,
        fontSize: 16,
        marginTop: 15
    },
    button: {
        marginTop: 10,
        paddingHorizontal: 10
    }
})

export default NewOrderTemplate;