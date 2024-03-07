import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { FAB } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import OrderTemplateItem from './OrderTemplateItem';
import { getOrderTemplates } from '../../services/OrderTemplatesService';
import SelectSymbol from '../../components/SelectSymbol/SelectSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';

function OrderTemplatesList({ navigation, route }) {

    const PAGE_SIZE = 10;
    const [orderTemplates, setOrderTemplates] = useState([]);
    const [page, setPage] = useState(1);
    const [refresh, setRefresh] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [canLoadMore, setCanLoadMore] = useState(false);
    const [isFuture, setIsFuture] = useState(false);
    const [hasFutures, setHasFutures] = useState(false);
    const [symbol, setSymbol] = useState("BTCUSDT");

    function loadOrderTemplates(symbol, page) {
        getOrderTemplates(symbol, page, isFuture)
            .then(results => {
                setIsLoading(false);

                if (page === 1)
                    setOrderTemplates(results.rows || []);
                else {
                    orderTemplates.push(...results.rows);
                    setOrderTemplates(orderTemplates);
                }
            })
            .catch(err => {
                setIsLoading(false);
                alert(err.response ? err.response.data : err.message);
                console.error(err.response ? err.response.data : err.message);
            })
    }

    useEffect(() => {
        AsyncStorage.getItem("hasFutures")
            .then(value => {
                setHasFutures(value === "true");

                if (route.params && route.params.symbol === symbol) {
                    setIsLoading(true);
                    setPage(1);
                    setIsFuture(route.params.isFuture ? true : false);
                    loadOrderTemplates(route.params.symbol, 1);
                }
                else
                    setSymbol(route.params ? route.params.symbol : 'BTCUSDT');
            })
    }, [route.params, refresh])

    useEffect(() => {
        setIsLoading(true);
        setPage(1);
        loadOrderTemplates(symbol, 1);
    }, [symbol, isFuture, refresh])

    useEffect(() => {
        if (page <= 1) return;
        loadOrderTemplates(symbol, page || 1);
    }, [page])

    function onEndReached() {
        if (!orderTemplates || orderTemplates.length % PAGE_SIZE !== 0) return;
        setPage(page + 1);
        setCanLoadMore(false);
    }

    const emptyList = (
        <View styles={styles.emptyList}>
            <Text>There are no order templates. Create one clicking on the button below.</Text>
        </View>
    )

    function viewForm(orderTemplate) {
        navigation.navigate("Order Templates", { screen: "NewOrderTemplate", params: { data: orderTemplate, isFuture, hasFutures } });
    }

    function newForm(navigation) {
        return navigation.navigate("Order Templates", { screen: 'NewOrderTemplate', params: { hasFutures, isFuture } });
    }

    function getOrderTemplateItem(obj) {
        return <OrderTemplateItem
            data={obj.item}
            onPress={() => viewForm(obj.item)}
            onRefresh={evt => setRefresh(Date.now())} />
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
                data={orderTemplates}
                initialNumToRender={PAGE_SIZE}
                onEndReached={evt => setCanLoadMore(true)}
                onEndReachedThreshold={0.3}
                refreshing={isLoading}
                onRefresh={() => setRefresh(Date.now())}
                onMomentumScrollEnd={evt => canLoadMore && onEndReached()}
                ListEmptyComponent={() => emptyList}
                renderItem={obj => getOrderTemplateItem(obj)}
                keyExtractor={obj => obj.id} />
            <FAB title={<Icon name="plus" size={20} color="white" />} placement="right" onPress={evt => newForm(navigation)} />
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

export default OrderTemplatesList;