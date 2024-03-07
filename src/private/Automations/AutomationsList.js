import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import NewAutomationButton from './NewAutomationButton';
import AutomationItem from './AutomationItem';
import { getAutomations } from '../../services/AutomationsService';

function AutomationsList({ route, navigation }) {

    const [automations, setAutomations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [canLoadMore, setCanLoadMore] = useState(false);
    const [refresh, setRefresh] = useState(0);

    function loadAutomations(page) {
        getAutomations(page)
            .then(results => {
                setIsLoading(false);

                if (page === 1)
                    setAutomations(results || []);
                else {
                    automations.push(...results);
                    setAutomations(automations);
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
            })
    }

    useEffect(() => {
        if (page <= 1) return;
        loadAutomations(page);
    }, [page])

    useEffect(() => {
        setIsLoading(true);
        setPage(1);
        loadAutomations(1);
    }, [route.params, refresh])

    const PAGE_SIZE = 10;

    const emptyList = (
        <View style={styles.emptyList}>
            <Text>There are no automations. Create one first.</Text>
        </View>
    )

    function onEndReached() {
        if (!automations || automations.length % PAGE_SIZE !== 0) return;
        setPage(page + 1);
        setCanLoadMore(false);
    }

    function viewDetails(automation) {
        if (automation.grids && automation.grids.length)
            navigation.navigate('Automations', { screen: 'NewGrid', params: { automation } });
        else
            navigation.navigate('Automations', { screen: 'NewAutomation', params: { automation } });
    }

    return (
        <>
            <FlatList
                data={automations}
                initialNumToRender={PAGE_SIZE}
                refreshing={isLoading}
                ListEmptyComponent={emptyList}
                onRefresh={evt => setRefresh(Date.now())}
                onEndReached={evt => setCanLoadMore(true)}
                onEndReachedThreshold={0.3}
                onMomentumScrollEnd={evt => canLoadMore && onEndReached()}
                renderItem={obj => <AutomationItem automation={obj.item} onPress={() => viewDetails(obj.item)} onRefresh={evt => setRefresh(Date.now())} />}
                keyExtractor={order => order.id} />
            <NewAutomationButton navigation={navigation} />
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

export default AutomationsList;