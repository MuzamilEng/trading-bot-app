import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { useTheme, FAB } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import { deleteAllAlerts, getAlerts } from '../../services/AlertsService';
import AlertItem from './AlertItem';

function AlertsList({ navigation, route }) {

    const { theme } = useTheme();

    const PAGE_SIZE = 10;
    const [alerts, setAlerts] = useState([]);
    const [page, setPage] = useState(1);
    const [refresh, setRefresh] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [canLoadMore, setCanLoadMore] = useState(false);

    function loadAlerts(page) {
        setIsLoading(true);
        getAlerts()
            .then(results => {
                setIsLoading(false);
    
                results = results || []; // Ensure results is not null
                console.log(results, "in alerts list");
    
                if (page === 1)
                    setAlerts(results.slice(0, PAGE_SIZE));
                else {
                    results = results.slice(0, page * PAGE_SIZE);
                    setAlerts(results);
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
            });
    }
    

    useEffect(() => {
        setPage(1);
        loadAlerts(1);
    }, [route.params, refresh])

    useEffect(() => {
        if (page <= 1) return;
        loadAlerts(page || 1);
    }, [page])

    async function deleteAll() {
        await deleteAllAlerts()
        setAlerts([]);
    }

    function onEndReached() {
        if (!alerts || alerts.length % PAGE_SIZE !== 0) return;
        setPage(page + 1);
        setCanLoadMore(false);
    }

    const emptyList = (
        <View style={styles.emptyList}>
            <Text>There are no alerts.</Text>
        </View>
    )

    return (
        <>
            <View style={styles.header}>
                <Icon.Button
                    name="chevron-left"
                    size={24}
                    color="black"
                    underlayColor="#ccc"
                    backgroundColor="transparent"
                    onPress={evt => navigation.goBack()} />
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
           { alerts && alerts?.length > 0  ?  <FlatList
                data={alerts ? alerts : []}
                initialNumToRender={PAGE_SIZE}
                onEndReached={evt => setCanLoadMore(true)}
                onEndReachedThreshold={0.3}
                refreshing={isLoading}
                onRefresh={evt => setRefresh(Date.now())}
                onMomentumScrollEnd={evt => canLoadMore && onEndReached()}
                ListEmptyComponent={() => emptyList}
                renderItem={obj => <AlertItem alert={obj?.item} />}
                keyExtractor={obj => obj?.date} /> : emptyList}
            <FAB
                title={<Icon name="trash" size={20} color="white" />}
                placement='right'
                onPress={deleteAll}
                buttonStyle={{ backgroundColor: theme.colors.danger }} />
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0,
        height: 90,
        paddingTop: 40,
        backgroundColor: '#ccc'
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 16
    },
    emptyList: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10
    }
})

export default AlertsList;