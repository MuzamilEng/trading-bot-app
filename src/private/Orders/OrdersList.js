import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import NewOrderButton from '../../components/NewOrderButton/NewOrderButton';
import SelectSymbol from '../../components/SelectSymbol/SelectSymbol';
import { getOrders } from '../../services/OrdersService';
import OrderItem from './OrderItem';

function OrdersList({ navigation, route }) {

    const PAGE_SIZE = 10;

    const [symbol, setSymbol] = useState("BTCUSDT");
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [canLoadMore, setCanLoadMore] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [isFuture, setIsFuture] = useState(false);
    const [hasFutures, setHasFutures] = useState(false);

    function loadOrders(symbol, page = 1) {
        getOrders(symbol, page, isFuture)
            .then(results => {
                setIsLoading(false);

                if (page === 1)
                    setOrders(results || []);
                else {
                    orders.push(...results);
                    setOrders(orders);
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
            })
    }

    useEffect(() => {
        setIsLoading(true);
        setPage(1);
        loadOrders(symbol, 1);
    }, [symbol, isFuture, refresh])

    useEffect(() => {
        if (page <= 1) return;
        loadOrders(symbol, page);
    }, [page])

    useEffect(() => {
        AsyncStorage.getItem("hasFutures")
            .then(value => {
                setHasFutures(value === 'true');
                if (route.params && route.params.symbol === symbol) {
                    setIsLoading(true);
                    loadOrders(symbol, 1);
                    setIsFuture(route.params.isFuture ? true : false);
                }
                else
                    setSymbol(route.params ? route.params.symbol : 'BTCUSDT');
            })
    }, [route.params, refresh])

    const emptyList = (
        <View style={styles.emptyList}>
            <Text>There are no orders for this symbol.</Text>
        </View>
    )

    function onEndReached() {
        if (!orders || orders.length % PAGE_SIZE !== 0) return;
        setPage(page + 1);
        setCanLoadMore(false);
    }

    function viewDetails(order) {
        navigation.navigate('OrderView', { order });
    }

    return (
        <>
            <View style={{ width: '100%', height: 50 }}>
                <SelectSymbol
                    isFuture={isFuture}
                    hasFutures={hasFutures}
                    symbol={symbol}
                    onSymbolChange={setSymbol}
                    onMarketChange={setIsFuture} />
            </View>
            <FlatList
                data={orders}
                initialNumToRender={PAGE_SIZE}
                refreshing={isLoading}
                ListEmptyComponent={emptyList}
                onRefresh={evt => setRefresh(Date.now())}
                onEndReached={evt => setCanLoadMore(true)}
                onEndReachedThreshold={0.3}
                onMomentumScrollEnd={evt => canLoadMore && onEndReached()}
                renderItem={obj => <OrderItem order={obj.item} onPress={() => viewDetails(obj.item)} />}
                keyExtractor={order => order.id} />
            <NewOrderButton navigation={navigation} symbol={""} isFuture={isFuture} />
        </>
    )
}

const styles = StyleSheet.create({
    emptyList: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10
    }
})

export default OrdersList;