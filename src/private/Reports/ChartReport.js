import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from 'react-native-elements';
import { LineChart } from 'react-native-chart-kit';

/**
 * props:
 * - data
 */
function ChartReport(props) {

    const { theme } = useTheme();

    const [data, setData] = useState({});

    useEffect(() => {
        setData(props.data);
    }, [props.data])

    const styles = StyleSheet.create({
        view: {
            flex: 0,
            height: 305,
            width: Dimensions.get('window').width - 20
        },
        chartStyle: {
            borderRadius: 16,
            padding: 5
        },
        containerStyle: {
            marginVertical: 8,
            borderRadius: 8
        }
    })

    function getTitle() {
        if (!data.profit) data.profit = "0";
        else data.profit = `${data.profit}`.substring(0, 8);

        if (!data.profitPerc) data.profitPerc = 0;

        const profit = data.profit >= 0 ? `+${data.profit}` : `${data.profit}`;
        const profitPerc = data.profitPerc >= 0 ? `(+${data.profitPerc.toFixed(2)}%)` : `(${data.profitPerc.toFixed(2)}%)`;
        return <Text style={theme.h1}>{data.quote} {profit} {profitPerc}</Text>
    }

    return (
        <View style={styles.view}>
            {getTitle()}
            {
                data.series && data.series.length && data.subs && data.subs.length
                    ? (
                        <ScrollView horizontal={true}>
                            <LineChart
                                data={{
                                    labels: data.subs,
                                    datasets: [{
                                        data: data.series
                                    }]
                                }}
                                width={1000}
                                height={250}
                                yAxisLabel='$'
                                verticalLabelRotation={30}
                                chartConfig={{
                                    backgroundColor: theme.colors.primary,
                                    decimalPlaces: 2,
                                    color: () => 'white',
                                    labelColor: () => 'white',
                                    style: styles.chartStyle
                                }}
                                bezier={true}
                                style={styles.containerStyle} />
                        </ScrollView>
                    )
                    : <ActivityIndicator />
            }
        </View>
    )
}

export default ChartReport;