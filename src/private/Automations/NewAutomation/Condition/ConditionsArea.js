import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-elements';
import { getIndexes } from '../../../../services/BeholderService';
import ConditionBuilder from './ConditionBuilder';
import SmartItem from '../../../../components/SmartItem/SmartItem';

/**
 * props:
 * - conditions
 * - symbol
 * - onChange
 * - type
 */
function ConditionsArea(props) {

    const { theme } = useTheme();

    const [indexes, setIndexes] = useState([]);
    const [conditions, setConditions] = useState([]);

    useEffect(() => {
        setConditions(props.conditions ? props.conditions.split(' && ') : []);
    }, [props.conditions])

    useEffect(() => {
        if (!props.symbol) return;

        getIndexes()
            .then(results => {

                const isWildcard = props.symbol.startsWith('*');
                let filteredIndexes = isWildcard
                    ? results.filter(k => k.symbol.endsWith(props.symbol.replace('*', '')))
                    : results.filter(k => k.symbol === props.symbol);

                if (isWildcard) {
                    filteredIndexes.forEach(ix => {
                        if (ix.variable.startsWith('WALLET')) {
                            ix.symbol = ix.symbol.replace('*', '');
                            ix.eval = ix.eval.replace('*', '');
                        }
                        else {
                            ix.eval = ix.eval.replace(ix.symbol, props.symbol);
                            ix.symbol = props.symbol;
                        }
                    })
                }
                else {
                    const baseWallet = results.find(ix => ix.variable.startsWith('WALLET') && props.symbol.startsWith(ix.symbol))
                    if (baseWallet) filteredIndexes.splice(0, 0, baseWallet);

                    const quoteWallet = results.find(ix => ix.variable.startsWith('WALLET') && props.symbol.endsWith(ix.symbol))
                    if (quoteWallet) filteredIndexes.splice(0, 0, quoteWallet);
                }

                filteredIndexes = filteredIndexes.filter((item, index, self) =>
                    index === self.findIndex(t => t.eval === item.eval)
                )

                setIndexes(filteredIndexes);
            })
            .catch(err => console.error(err.response ? err.response.data : err.message));

    }, [props.symbol])

    function onAddCondition(condition) {
        if (conditions?.includes(condition)) return;

        conditions?.push(condition);
        setConditions(conditions);
        console.log(conditions, "CONDITIONS");

        props?.onChange(conditions?.map(c => c.trim()).join(' && '));
    }

    function getText(condition) {
        return condition
            .replace('>', ' >')
            .replace('<', ' <')
            .replace('!', ' !')
            .replace('==', '=')
            .replace(new RegExp("MEMORY\\['", "g"), '')
            .replace(new RegExp("'\\]", "g"), '')
            .replace(new RegExp(props.symbol + ":", "g"), '')
            .replace(new RegExp("\\.current", "g"), '');
    }

    function onDeleteCondition(condition) {
        const index = conditions.findIndex(c => c === condition);
        conditions.splice(index, 1);
        setConditions(conditions);
        props.onChange(conditions.map(c => c.trim()).join(' && '));
    }

    return (
        <View style={theme.container}>
            <ConditionBuilder indexes={indexes} onAddCondition={onAddCondition} />
            <View style={styles.list}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} alwaysBounceVertical={true}>
                    {
                        conditions && conditions.length
                            ? conditions.map(condition => (
                                <SmartItem
                                    key={condition}
                                    text={getText(condition)}
                                    icon="help-circle"
                                    style={{ fontSize: 12 }}
                                    onDelete={onDeleteCondition} />
                            ))
                            : <></>
                    }
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20
    }
})

export default ConditionsArea;