import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Button, useTheme } from 'react-native-elements';
import SelectFiat from '../../components/SelectFiat/SelectFiat';
import NewOrderButton from '../../components/NewOrderButton/NewOrderButton';
import { getFullBalance } from '../../services/ExchangeService';
import WalletItem from './WalletItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Wallet({ navigation, route }) {

    const { theme } = useTheme();

    const [wallet, setWallet] = useState({});
    const [fiat, setFiat] = useState('USD');
    const [hasFutures, setHasFutures] = useState(false);
    const [isFuture, setIsFuture] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!fiat) return;
    
        setIsLoading(true);
        AsyncStorage.getItem("hasFutures")
            .then(value => {
                setHasFutures(value === 'true');
                return getFullBalance(fiat, isFuture);
            })
            .then(results => {
                const updatedWallet = {
                    fiatEstimate: results?.fiatEstimate,
                    coins: Object.entries(results)?.map(prop => {
                        return {
                            coin: prop[0],
                            available: prop[1]?.available,
                            onOrder: prop[1]?.onOrder,
                            fiatEstimate: prop[1]?.fiatEstimate,
                            avg: prop[1]?.avg
                        }
                    })
                };
                setWallet(updatedWallet);
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
                alert(err.response ? err.response.data : err.message);
                console.error(err.response ? err.response.data : err.message);
            });
    }, [fiat, isFuture])
    

    function onFiatChange(value) {
        setWallet({});
        setFiat(value);
    }

    return (
        <>
            <View style={styles.page}>
                {/* <Text >Hello motto</Text> */}
                <View style={styles.buttonView}>
                    {
                        hasFutures
                            ? (
                                <Button
                                    title={isFuture ? "Futures" : "Spot"}
                                    titleStyle={styles.marketTitle}
                                    buttonStyle={styles.marketButton}
                                    onPress={evt => setIsFuture(!isFuture)} />
                            )
                            : <></>
                    }
                    <View style={styles.viewFiat}>
                        <SelectFiat onChange={onFiatChange} />
                    </View>
                </View>
                {
                    isLoading
                        ? <ActivityIndicator style={{ marginTop: 20 }} />
                        : (
                            <>
                                <View style={styles.header}>
                                    <Text style={{
                                        ...theme.h2,
                                        ...styles.estimate
                                    }}>
                                        Wallet Total:
                                    </Text>
                                    <Text style={styles.estimate}>
                                        {
                                            wallet?.fiatEstimate
                                                ? wallet?.fiatEstimate
                                                : <ActivityIndicator />
                                        }
                                    </Text>
                                </View>
                                <View style={styles.list}>
                                    <ScrollView>
                                        {
                                            wallet.coins
                                                ? wallet?.coins?.filter(coin => parseFloat(coin.available) > 0 || parseFloat(coin.onOrder) > 0).map(coin => (
                                                    <WalletItem coin={coin} fiat={fiat} key={coin.coin} />
                                                ))
                                                : <ActivityIndicator />
                                        }
                                    </ScrollView>
                                </View>
                            </>
                        )
                }
            </View>
            <NewOrderButton symbol={""} navigation={navigation} />
        </>
    )
}

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        flex: 1
    },
    header: {
        flexDirection: 'row',
        flex: 0,
        height: 40
    },
    estimate: {
        marginTop: 10,
        marginLeft: 10,
        fontSize: 16
    },
    list: {
        marginTop: 10
    },
    buttonView: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    marketTitle: {
        color: 'white',
        fontWeight: 'normal',
        fontSize: 10
    },
    marketButton: {
        backgroundColor: 'black',
        alignSelf: 'left',
        marginTop: 3,
        marginLeft: 10
    },
    viewFiat: {
        flex: 1,
        alignContent: 'flex-start'
    }
})

export default Wallet;