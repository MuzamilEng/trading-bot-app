import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Overlay, Button, FAB } from 'react-native-elements';
import { thirtyDaysAgo } from '../../services/OrdersService';
import { Feather as Icon } from '@expo/vector-icons';
import SelectQuote from '../../components/SelectQuote/SelectQuote';
import DateInput from '../../components/DateInput/DateInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * props:
 * - onFilter
 */
function FilterReport(props) {

    const [filter, setFilter] = useState({
        quote: 'USDT',
        startDate: thirtyDaysAgo(),
        endDate: Date.now(),
        isFuture: false
    });

    const [showFilter, setShowFilter] = useState(false);
    const [hasFutures, setHasFutures] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("hasFutures")
            .then(value => setHasFutures(value === "true"));
    }, [])

    function onFilter() {
        setShowFilter(false);
        props.onFilter(filter);
    }

    return (
        <>
            <FAB title={<Icon name="filter" size={20} color="white" />} placement='right' onPress={evt => setShowFilter(true)} />
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={showFilter}
                onBackdropPress={evt => setShowFilter(false)}>
                {
                    hasFutures
                        ? (
                            <Button
                                style={styles.marketButton}
                                title={filter.isFuture ? "Futures" : "Spot"}
                                onPress={evt => setFilter(prevState => ({ ...prevState, isFuture: !filter.isFuture }))} />
                        )
                        : <></>
                }
                <SelectQuote isFuture={filter.isFuture} onChange={quote => setFilter(prevState => ({ ...prevState, quote }))} />
                <DateInput label="Start Date:" timestamp={filter.startDate} onChange={startDate => setFilter(prevState => ({ ...prevState, startDate }))} />
                <DateInput label="End Date:" timestamp={filter.endDate} onChange={endDate => setFilter(prevState => ({ ...prevState, endDate }))} />
                <Button
                    style={styles.filterButton}
                    title=" Filter Report"
                    icon={<Icon name="filter" size={20} color="white" />}
                    onPress={onFilter} />
            </Overlay>
        </>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 0,
        width: '90%'
    },
    filterButton: {
        paddingTop: 10,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    marketButton: {
        paddingHorizontal: 10,
        paddingTop: 10,
        marginBottom: 10
    }
})

export default FilterReport;