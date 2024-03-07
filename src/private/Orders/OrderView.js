import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme, Button } from 'react-native-elements';
import { getOrder, syncOrder, cancelOrder } from '../../services/OrdersService';
import { Feather as Icon } from '@expo/vector-icons';
import Block from '../../components/Block/Block';
import { getColorByStatus } from '../../Utils';

import "intl";
import "intl/locale-data/jsonp/pt-BR";

function OrderView({ navigation, route }) {

    const { theme } = useTheme();

    const [order, setOrder] = useState({});

    useEffect(() => {
        setOrder({ ...route.params.order, isSyncing: true, isCanceling: false });
        getOrder(route.params.order.orderId, route.params.order.clientOrderId)
            .then(result => setOrder({ ...result, isSyncing: false }))
            .catch(err => console.error(err))
    }, [route.params])

    function getDate(order) {
        if (!order.transactTime && !order.updatedAt) return "";
        const date = new Date(order.transactTime || order.updatedAt);
        const frm = Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(date);
        return frm;
    }

    function doCancelPress() {
        setOrder({ ...order, isCanceling: true });
        cancelOrder(order.symbol, order.orderId, !!order.positionSide)
            .then(result => {
                setOrder({ ...order, isCanceling: false });
                navigation.navigate("OrdersList", { symbol: order.symbol });
            })
            .catch(err => {
                setOrder({ ...order, isCanceling: false });
                console.error(err);
            })
    }

    function doSyncPress() {
        setOrder({ ...order, isSyncing: true });
        syncOrder(order.id, !!order.positionSide)
            .then(result => setOrder({ ...result, isSyncing: false }))
            .catch(err => {
                setOrder({ ...order, isSyncing: false });
                console.error(err);
            })
    }

    function getSide(order) {
        const position = order.positionSide ? `(${order.positionSide})` : "";
        return <Text>{order.side} {position}</Text>;
    }

    return (
        <>
            <View style={theme.page}>
                <View style={styles.header}>
                    <Icon.Button
                        name="chevron-left"
                        size={24}
                        color="black"
                        backgroundColor="transparent"
                        style={{ marginTop: 10 }}
                        onPress={() => navigation.navigate("OrdersList", { symbol: order.symbol, isFuture: !!order.positionSide })} />
                    <View style={styles.p}>
                        <Text style={{ ...theme.h2, marginRight: 20 }}>{order.symbol} #{order.id}</Text>
                        <Block color={getColorByStatus(order.status, theme)} style={{ flex: 0 }}>
                            <View style={styles.row}>
                                {
                                    order.automationId
                                        ? <Icon name="command" size={16} color="white" />
                                        : <Icon name="user" size={16} color="white" />
                                }
                                <Text style={styles.status}>{order.status}</Text>
                            </View>
                        </Block>
                    </View>
                </View>
                <View style={theme.container}>
                    <View style={theme.inputContainer}>
                        <ScrollView>
                            <View style={styles.p}>
                                <Text style={styles.bold}>Binance Order Id: </Text>
                                <Text>{order.orderId}</Text>
                            </View>
                            {
                                order.automationId
                                    ? (
                                        <View style={styles.p}>
                                            <Text style={styles.bold}>Automation: </Text>
                                            <Text>{order.automation.name}</Text>
                                        </View>
                                    )
                                    : <></>
                            }
                            <View style={styles.p}>
                                <Text style={styles.bold}>Side: </Text>
                                {getSide(order)}
                                <Text style={styles.bold}>Type: </Text>
                                <Text>{order.type}</Text>
                            </View>
                            <View style={styles.p}>
                                <Text style={styles.bold}>Quantity: </Text>
                                <Text>{order.quantity}</Text>
                            </View>
                            {
                                order.positionSide
                                    ? (
                                        <View style={styles.p}>
                                            <Text style={styles.bold}>Reduce Only? </Text>
                                            <Text>{order.reduceOnly ? "yes" : "no"}</Text>
                                        </View>
                                    )
                                    : <></>
                            }
                            {
                                order.activatePrice
                                    ? (
                                        <View style={styles.p}>
                                            <Text style={styles.bold}>Activation Price: </Text>
                                            <Text>{order.activatePrice}</Text>
                                            <Text style={styles.bold}>Callback Rate: </Text>
                                            <Text>{order.priceRate}</Text>
                                        </View>
                                    )
                                    : <></>
                            }
                            {
                                order.limitPrice
                                    ? (
                                        <View style={styles.p}>
                                            <Text style={styles.bold}>Limit Price: </Text>
                                            <Text>{order.limitPrice}</Text>
                                        </View>
                                    )
                                    : <></>
                            }
                            {
                                order.stopPrice
                                    ? (
                                        <View style={styles.p}>
                                            <Text style={styles.bold}>Stop Price: </Text>
                                            <Text>{order.stopPrice}</Text>
                                        </View>
                                    )
                                    : <></>
                            }
                            {
                                order.avgPrice
                                    ? (
                                        <View style={styles.p}>
                                            <Text style={styles.bold}>Avg. Price: </Text>
                                            <Text>{order.avgPrice}</Text>
                                        </View>
                                    )
                                    : <></>
                            }
                            <View style={styles.p}>
                                <Text style={styles.bold}>Date: </Text>
                                <Text>{getDate(order)}</Text>
                            </View>
                            {
                                order.status === 'FILLED'
                                    ? (
                                        <>
                                            <View style={styles.p}>
                                                <Text style={styles.bold}>Commission: </Text>
                                                <Text>{order.commission}</Text>
                                            </View>
                                            <View style={styles.p}>
                                                <Text style={styles.bold}>Net: </Text>
                                                <Text>{order.net}</Text>
                                            </View>
                                        </>
                                    )
                                    : <></>
                            }
                            <View style={styles.p}>
                                <Text style={styles.bold}>Obs.: </Text>
                            </View>
                            <View style={styles.p}>
                                <Text style={{ marginLeft: 10 }}>{order.obs}</Text>
                            </View>
                        </ScrollView>
                        <View style={styles.button}>
                            <Button
                                title={order.isSyncing ? <ActivityIndicator /> : " Sync Order"}
                                icon={() => order.isSyncing ? null : <Icon name="refresh-cw" size={20} color="white" />}
                                disabled={order.avgPrice || order.isSyncing || ['CANCELED', 'REJECTED', 'EXPIRED', 'NEW_ADL', 'NEW_INSURANCE'].includes(order.status)}
                                onPress={doSyncPress}
                                buttonStyle={{ backgroundColor: theme.colors.info }} />
                        </View>
                        <View style={styles.button}>
                            <Button
                                title={order.isCanceling ? <ActivityIndicator /> : " Cancel Order"}
                                icon={() => order.isCanceling ? null : <Icon name="x" size={20} color="white" />}
                                onPress={doCancelPress}
                                disabled={order.status !== 'NEW' || order.isCanceling}
                                buttonStyle={{ backgroundColor: theme.colors.danger }} />
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        flex: 0,
        height: 60,
        backgroundColor: '#ccc'
    },
    p: {
        marginTop: 10,
        paddingRight: 10,
        flexDirection: 'row',
        flex: 0,
        height: 30
    },
    status: {
        color: 'white',
        marginLeft: 10,
        fontSize: 10
    },
    row: {
        flexDirection: 'row'
    },
    bold: {
        fontWeight: 'bold',
        marginLeft: 10
    },
    button: {
        marginTop: 10
    }
})

export default OrderView;