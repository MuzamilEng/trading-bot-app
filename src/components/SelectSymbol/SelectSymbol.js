import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useTheme, Input, Button, Overlay, ListItem } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import { searchSymbols } from '../../services/SymbolsService';

/**
 * props:
 * - symbol
 * - hasFutures
 * - isFuture
 * - onSymbolChange
 * - onMarketChange
 */
function SelectSymbol(props) {

    const { theme } = useTheme();

    const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
    const [showSearch, setShowSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const [isFuture, setIsFuture] = useState(false);

    useEffect(() => {
        if (props.isFuture !== null && props.isFuture !== undefined)
            setIsFuture(props.isFuture);
        else
            setIsFuture(false);

        if (props.symbol) {
            setSelectedSymbol(props.symbol);
            props.onSymbolChange(props.symbol);
        }
        else {
            AsyncStorage.getItem('symbol')
                .then(value => {
                    setSelectedSymbol(value || 'BTCUSDT');
                    props.onSymbolChange(value || 'BTCUSDT');
                });
        }
    }, [props.symbol, props.isFuture, isFuture])

    function onChangeText(text) {
        setIsLoading(true);
        searchSymbols(text)
            .then(result => {
                setItems(isFuture
                    ? result.rows.filter(r => /(BUSD|USDT)$/.test(r.symbol))
                    : result.rows);
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
                setError(err.response ? err.response.data : err.message);
            })
    }

    function onItemPress(symbol) {
        setSelectedSymbol(symbol);
        props.onSymbolChange(symbol);
        setShowSearch(false);
        AsyncStorage.setItem('symbol', symbol);
    }

    function onMarketPress(evt) {
        if (props.onMarketChange)
            props.onMarketChange(!isFuture);
    }

    return (
        <>
            <View style={styles.buttonView}>
                {
                    props.hasFutures
                        ? (
                            <Button
                                title={isFuture ? "Futures" : "Spot"}
                                titleStyle={styles.marketTitle}
                                buttonStyle={styles.marketButton}
                                onPress={onMarketPress} />
                        )
                        : <></>
                }
                <Button
                    title={selectedSymbol}
                    type="clear"
                    titleStyle={styles.symbolTitle}
                    buttonStyle={styles.symbolButton}
                    onPress={evt => setShowSearch(true)}
                    icon={<Icon name="chevron-down" size={20} color="black" />}
                    iconRight={true} />
            </View>

            <Overlay
                visible={showSearch}
                onBackdropPress={evt => setShowSearch(false)}
                overlayStyle={styles.overlay}>
                <Input
                    placeholder="Type a symbol"
                    autoCapitalize='characters'
                    leftIcon={
                        isLoading
                            ? <ActivityIndicator />
                            : <Icon name="search" size={24} color="black" />
                    }
                    rightIcon={<Icon.Button name="x" size={24} color="black" iconStyle={styles.closeButton} backgroundColor="transparent" onPress={evt => setShowSearch(false)} />}
                    onChangeText={onChangeText} />
                {
                    error
                        ? <Text style={{ color: theme.colors.danger }}>{error}</Text>
                        : <></>
                }
                <View style={styles.list}>
                    {
                        items.map(symbol => (
                            <ListItem key={symbol.symbol} bottomDivider={true} onPress={() => onItemPress(symbol.symbol)}>
                                <ListItem.Content>
                                    <ListItem.Title>{symbol.symbol}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))
                    }
                </View>
            </Overlay>
        </>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 0,
        width: '90%',
        height: '75%'
    },
    list: {
        flex: 1,
        width: '100%'
    },
    closeButton: {
        paddingRight: 0,
        marginRight: 0
    },
    symbolTitle: {
        color: 'black'
    },
    symbolButton: {
        width: '100%'
    },
    buttonView: {
        flex: 1,
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
        marginTop: 3
    }
})

export default SelectSymbol;