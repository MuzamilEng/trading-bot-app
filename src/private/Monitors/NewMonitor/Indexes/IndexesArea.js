import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-elements';
import IndexBuilder from './IndexBuilder';
import SmartItem from '../../../../components/SmartItem/SmartItem';

/**
 * props:
 * - indexes
 * - onChange
 */
function IndexesArea(props) {

    const { theme } = useTheme();

    const [indexes, setIndexes] = useState([]);

    useEffect(() => {
        //[RSI], [EMA, 20]
        if (props?.indexes) {
            setIndexes(props?.indexes.split(',').map(ix => {
                const split = ix.split('_');
                if (split.length > 1) {
                    const key = split[0];
                    split.splice(0, 1);
                    return { key, params: split.join(',') };
                }
                return { key: split[0], params: '' };
            }))
        }
    }, [props?.indexes])

    function onRemoveIndex(key) {
        const position = indexes.findIndex(ix => ix.key === key);
        indexes.splice(position, 1);
        setIndexes(indexes);
        props.onChange(indexes);
    }

    function getText(index) {
        return index.key + (index.params ? "_" + index.params.replace(/,/i, "_") : "");
    }

    function onAddIndex(index) {
        if (indexes?.some(ix => ix?.key === index?.key)) return;

        indexes?.push(index);
        setIndexes(indexes);
        props?.onChange(indexes);
    }

    return (
        <View style={theme.container}>
            <IndexBuilder onAddIndex={onAddIndex} />
            <View style={styles.list}>
                <ScrollView>
                    {
                        indexes && indexes.length > 0
                            ? (
                                indexes.map(index => (
                                    <SmartItem
                                        key={index.key}
                                        text={getText(index)}
                                        onDelete={evt => onRemoveIndex(index.key)}
                                        icon="bar-chart-2" />
                                ))
                            )
                            : <></>
                    }
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 20
    }
})

export default IndexesArea;