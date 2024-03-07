import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme, Tab, Button } from 'react-native-elements';
import HeaderRow from '../../../components/HeaderRow/HeaderRow';
import CurrentPrice from '../../../components/CurrentPrice/CurrentPrice';
import WalletSummary from '../../../components/WalletSummary/WalletSummary';
import { Feather as Icon } from '@expo/vector-icons';
import GridArea from './GridArea';
import GeneralArea from './GeneralArea';
import { saveGrid } from '../../../services/AutomationsService';

function NewGrid({ route, navigation }) {

    const { theme } = useTheme();

    const DEFAULT_AUTOMATION = {
        symbol: 'BTCUSDT',
        name: '',
        actions: [],
        conditions: '',
        schedule: '',
        logs: false,
        isActive: false
    }

    const DEFAULT_GRID = {
        lowerLimit: '',
        upperLimit: '',
        levels: '',
        quantity: ''
    }

    const [automation, setAutomation] = useState(DEFAULT_AUTOMATION);
    const [grid, setGrid] = useState(DEFAULT_GRID);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        setError('');

        if (route.params.automation) {
            setAutomation(route.params.automation);

            const conditionSplit = route.params.automation.conditions.split(' && ');
            if (!conditionSplit || conditionSplit.length < 2) return;

            const quantity = route.params.automation.grids[0].orderTemplate.quantity;
            const grid = {
                lowerLimit: conditionSplit[0].split('>')[1],
                upperLimit: conditionSplit[1].split('<')[1],
                quantity,
                levels: route.params.automation.grids.length + 1
            }
            setGrid(grid);
        }
        else {
            setAutomation({ ...DEFAULT_AUTOMATION });
            setGrid({ ...DEFAULT_GRID });
        }
    }, [route.params])

    function onPress() {
        setError('');

        automation.name = `GRID ${automation.symbol} #${grid.levels}`;
        automation.actions = [{ type: 'GRID' }];
        automation.indexes = `${automation.symbol}:BOOK`;
        automation.conditions = `MEMORY['${automation.symbol}:BOOK'].current.bestAsk>${grid.lowerLimit} && MEMORY['${automation.symbol}:BOOK'].current.bestBid<${grid.upperLimit}`;

        setIsLoading(true);

        saveGrid(automation.id, automation, grid.levels, grid.quantity)
            .then(result => {
                setIsLoading(false);
                navigation.navigate('Automations', { screen: 'AutomationsList', params: { result } });
            })
            .catch(err => {
                setError(err.response ? err.response.data : err.message);
                setIsLoading(false);
            })
    }

    return (
        <View style={theme.page}>
            <View style={styles.header}>
                <HeaderRow
                    symbol={automation.symbol}
                    onBackPress={evt => navigation.navigate('Automations', { screen: 'AutomationsList' })}
                    onSymbolChange={symbol => setAutomation({ ...DEFAULT_AUTOMATION, symbol })} />
                <CurrentPrice symbol={automation.symbol} />
                <WalletSummary symbol={automation.symbol} header={false} style={{ paddingHorizontal: 20 }} />
            </View>

            <Tab
                value={tabIndex}
                onChange={setTabIndex}
                indicatorStyle={{ backgroundColor: 'black' }}>
                <Tab.Item buttonStyle={styles.tabButton} style={styles.tab} icon={<Icon name="settings" size={20} color="black" />} />
                <Tab.Item buttonStyle={styles.tabButton} style={styles.tab} icon={<Icon name="grid" size={20} color="black" />} />
            </Tab>

            {
                tabIndex === 0
                    ? <GeneralArea
                        automation={automation}
                        grid={grid}
                        onAutomationChange={data => setAutomation({ ...automation, [data.name]: data.value })}
                        onGridChange={data => setGrid({ ...grid, [data.name]: data.value })} />
                    : <></>
            }

            {
                tabIndex === 1
                    ? <GridArea grids={automation.grids} />
                    : <></>
            }

            <View style={styles.button}>
                <Button
                    title={isLoading ? <ActivityIndicator /> : " Save Grid"}
                    disabled={isLoading}
                    icon={() => <Icon name="save" size={20} color="white" />}
                    onPress={evt => onPress()} />
                {
                    error
                        ? <Text style={{ ...theme.alert, marginHorizontal: 0 }}>{error}</Text>
                        : <></>
                }
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    header: {
        flex: 0,
        height: 120,
        backgroundColor: '#ccc'
    },
    tabButton: {
        backgroundColor: '#ccc'
    },
    tab: {
        backgroundColor: '#ccc',
        paddingBottom: 6
    },
    button: {
        margin: 10,
        paddingHorizontal: 10
    }
})

export default NewGrid;