import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { getFuturesPositions } from '../../services/ExchangeService';
import NewOrderButton from '../../components/NewOrderButton/NewOrderButton';
import PositionItem from './PositionItem';

function PositionsList({ route, navigation }) {

    const [positions, setPositions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        getFuturesPositions()
            .then(results => {
                setIsLoading(false);
                setPositions(results.filter(p => parseFloat(p.positionAmt) !== 0));
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err.response ? err.response.data : err.message);
                alert(err.response ? err.response.data : err.message);
            })
    }, [route.params, refresh])

    const emptyList = (
        <View style={styles.emptyList}>
            <Text>There are no positions opened.</Text>
        </View>
    )

    function viewDetails(symbol) {
        navigation.navigate("PositionView", { symbol });
    }

    return (
        <>
            <FlatList
                data={positions}
                refreshing={isLoading}
                onRefresh={() => setRefresh(Date.now())}
                ListEmptyComponent={() => emptyList}
                renderItem={obj => <PositionItem position={obj.item} onPress={() => viewDetails(obj.item.symbol)} />}
                keyExtractor={position => position.symbol} />
            <NewOrderButton navigation={navigation} symbol={""} isFuture={true} />
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

export default PositionsList;