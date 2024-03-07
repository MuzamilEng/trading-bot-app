import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-elements';
import { getDayTradeReport, getOrdersReport } from '../../services/OrdersService';
import FilterReport from './FilterReport';
import ChartReport from './ChartReport';
import InfoBlock from '../../components/InfoBlock/InfoBlock';
import AutomationReport from './Automation/AutomationReport';

function Reports() {

    const { theme } = useTheme();

    const [report, setReport] = useState({});
    const [filter, setFilter] = useState({ quote: 'USDT' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log(filter, "filter in use effect");
        if (!filter.quote) return;

        setIsLoading(true);

        let promise;
        if (filter.startDate && filter.startDate === filter.endDate) {
            console.log(filter, "filter in promise");
            promise = getDayTradeReport(filter.quote, filter.startDate, filter.isFuture);
            console.log(promise, "trade report")
        }
        else 
            promise = getOrdersReport(filter.quote, filter.startDate, filter.endDate, filter.isFuture);
        console.log(promise, "else report");
        promise
            .then(result => {
                setReport(result);
                console.log(result, "result in promise");
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setIsLoading(false);
            })
    }, [filter])

    return (
        <>
            {
                isLoading
                    ? <ActivityIndicator />
                    : (
                        <View style={theme.container}>
                            <ChartReport data={report} />
                            <View style={styles.row}>
                                <InfoBlock title="Buy Volume" text={`$${report.buyVolume}`.substring(0, 10)} color="warning" />
                                <InfoBlock title="Sell Volume" text={`$${report.sellVolume}`.substring(0, 10)} color="success" />
                                <InfoBlock title="Orders" text={report.orders} color="info" />
                            </View>
                            <AutomationReport data={report.automations} />
                        </View>
                    )
            }
            <FilterReport onFilter={filter => setFilter({ ...filter })} />
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginHorizontal: 6
    }
})

export default Reports;