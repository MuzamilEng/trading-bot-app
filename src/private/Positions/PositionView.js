import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Divider, Button } from 'react-native-elements';
import { getFuturesPositions, closeFuturesPosition } from '../../services/ExchangeService';
import { Feather as Icon } from '@expo/vector-icons';
import Block from '../../components/Block/Block';
import "intl";
import "intl/locale-data/jsonp/en";

function PositionView({ route, navigation }) {

    const { theme } = useTheme();

    const [position, setPosition] = useState(null);

    useEffect(() => {
        getFuturesPositions(route.params.symbol)
            .then(results => setPosition({ ...results[0], isClosing: false }))
            .catch(err => {
                alert(err.response ? err.response.data : err.message);
                console.error(err.response ? err.response.data : err.message);
            })
    }, [route.params])

    function getColor(positionSide) {
        switch (positionSide) {
            case 'LONG': return theme.colors.success;
            case 'SHORT': return theme.colors.danger;
            default: return theme.colors.warning;
        }
    }

    function getDate(position) {
        if (!position.updateTime) return "";
        const date = new Date(parseInt(position.updateTime));
        const frm = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(date);
        return frm;
    }

    function doClosePress(evt) {
        setPosition({ ...position, isClosing: true });
        closeFuturesPosition(position.symbol)
            .then(result => {
                setPosition({ ...position, isClosing: false });
                navigation.navigate("PositionsList", {});
            })
            .catch(err => {
                setPosition({ ...position, isClosing: false });
                alert(err.response ? err.response.data : err.message);
                console.error(err.response ? err.response.data : err.message);
            })
    }

    return (
        !position
            ? <ActivityIndicator style={{ marginTop: 20 }} />
            : (
                <>
                    <View style={theme.page}>
                        <View style={styles.header}>
                            <Icon.Button
                                name="chevron-left"
                                size={24}
                                color="black"
                                style={{ marginTop: 10 }}
                                backgroundColor="transparent"
                                onPress={() => navigation.navigate("PositionsList", {})} />
                            <View style={styles.column}>
                                <View style={styles.p}>
                                    <Text style={{ ...theme.h2, marginRight: 20 }}>{position.symbol}</Text>
                                    <Block color={getColor(position.positionSide)} style={{ flex: 0 }}>
                                        <View style={styles.row}>
                                            <Icon name="book-open" size={16} color="white" />
                                            <Text style={styles.status}>{position.positionSide}</Text>
                                        </View>
                                    </Block>
                                    <Block color={theme.colors.info} style={{ flex: 0 }}>
                                        <View style={styles.row}>
                                            <Icon name="fast-forward" size={16} color="white" />
                                            <Text style={styles.status}>{position.leverage + "x"}</Text>
                                        </View>
                                    </Block>
                                </View>
                            </View>
                        </View>
                        <View style={theme.container}>
                            <View style={theme.inputContainer}>
                                <ScrollView>
                                    <View style={styles.p}>
                                        <Text style={styles.bold}>Amount: </Text>
                                        <Text>{`${position.positionAmt.substring(0, 10)} (${position.notional.substring(0, 10)})`}</Text>
                                    </View>
                                    <View style={styles.p}>
                                        <Text style={styles.bold}>Profit: </Text>
                                        <Text>{`${position.unRealizedProfit.substring(0, 10)}`}</Text>
                                    </View>
                                    <View style={styles.p}>
                                        <Text style={styles.bold}>Date: </Text>
                                        <Text>{getDate(position)}</Text>
                                    </View>
                                    <Divider />
                                    <View style={styles.p}>
                                        <Text style={styles.bold}>Prices</Text>
                                    </View>
                                    <View style={styles.p}>
                                        <Text style={styles.bold}>Entry: </Text>
                                        <Text>{position.entryPrice.substring(0, 10)}</Text>
                                        <Text style={styles.bold}>Mark: </Text>
                                        <Text>{position.markPrice.substring(0, 10)}</Text>
                                    </View>
                                    <View style={styles.p}>
                                        <Text style={styles.bold}>Liquidation: </Text>
                                        <Text>{position.liquidationPrice.substring(0, 10)}</Text>
                                    </View>
                                    <Divider />
                                    <View style={styles.p}>
                                        <Text style={styles.bold}>Margin</Text>
                                    </View>
                                    <View style={styles.p}>
                                        <Text style={styles.bold}>Type: </Text>
                                        <Text>{position.marginType ? position.marginType.toUpperCase() : ""}</Text>
                                        {
                                            position.marginType === 'isolated'
                                                ? (
                                                    <>
                                                        <Text style={styles.bold}>Wallet: </Text>
                                                        <Text>{position.isolatedWallet.substring(0, 10)}</Text>
                                                    </>
                                                )
                                                : <></>
                                        }
                                    </View>
                                    <View style={styles.p}>
                                        <Text style={styles.bold}>Auto Add Margin: </Text>
                                        <Text>{position.isAutoAddMargin}</Text>
                                    </View>
                                </ScrollView>
                                <View style={styles.button}>
                                    <Button
                                        title={position.isClosing ? <ActivityIndicator /> : " Close Position"}
                                        icon={() => position.isClosing ? null : <Icon name="x" size={20} color="white" />}
                                        onPress={doClosePress}
                                        buttonStyle={{ backgroundColor: theme.colors.danger }} />
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            )
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        flex: 0,
        height: 60,
        backgroundColor: '#ccc'
    },
    column: {
        flexDirection: 'column',
        flex: 1
    },
    p: {
        marginTop: 10,
        paddingRight: 10,
        flexDirection: 'row',
        flex: 0,
        height: 30
    },
    row: {
        flexDirection: 'row'
    },
    status: {
        color: 'white',
        marginLeft: 10,
        fontSize: 10
    },
    bold: {
        fontWeight: 'bold',
        marginLeft: 10
    },
    button: {
        marginTop: 10
    }
})

export default PositionView;