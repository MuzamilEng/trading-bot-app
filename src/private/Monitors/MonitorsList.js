import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FAB } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import MonitorItem from './MonitorItem';
import { getMonitors } from '../../services/MonitorsService';

function MonitorsList({ route, navigation }) {

    const PAGE_SIZE = 10;
    const [monitors, setMonitors] = useState([]);
    const [page, setPage] = useState(1);
    const [canLoadMore, setCanLoadMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(0);

    function loadMonitors(page) {
        getMonitors(page)
            .then(results => {
                setIsLoading(false);

                if (page === 1)
                    setMonitors(results || []);
                else {
                    monitors.push(...results);
                    setMonitors(monitors);
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
        loadMonitors(1);
    }, [route.params, refresh])

    useEffect(() => {
        if (page <= 1) return;
        loadMonitors(page || 1);
    }, [page])

    function onEndReached() {
        if (!monitors || monitors.length % PAGE_SIZE !== 0) return;
        setPage(page + 1);
        setCanLoadMore(false);
    }

    const emptyList = (
        <View style={styles.emptyList}>
            <Text>There are no monitors. Create one first.</Text>
        </View>
    )

    function viewForm(monitor) {
        navigation.navigate('Monitors', { screen: 'NewMonitor', params: { monitor } });
    }

    return (
        <>
            <FlatList
                data={monitors}
                initialNumToRender={PAGE_SIZE}
                onEndReached={evt => setCanLoadMore(true)}
                onEndReachedThreshold={0.3}
                refreshing={isLoading}
                onRefresh={() => setRefresh(Date.now())}
                onMomentumScrollEnd={evt => canLoadMore && onEndReached()}
                ListEmptyComponent={() => emptyList}
                renderItem={obj => <MonitorItem monitor={obj.item} onPress={evt => viewForm(obj.item)} onRefresh={evt => setRefresh(Date.now())} />}
                keyExtractor={obj => obj.id} />
            <FAB
                title={<Icon name="plus" size={20} color="white" />}
                placement='right'
                onPress={evt => navigation.navigate('Monitors', { screen: 'NewMonitor', params: {} })} />
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

export default MonitorsList;