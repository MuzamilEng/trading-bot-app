import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, ListItem } from 'react-native-elements';
import Block from '../../../components/Block/Block';

/**
 * props:
 * - grids
 */
function GridArea(props) {

    const { theme } = useTheme();

    if (!props.grids || !props.grids.length) {
        return (
            <View style={theme.container}>
                <View style={{ ...theme.inputContainer, ...styles.empty }}>
                    <Text>There are no grids to seed.</Text>
                    <Text>Create one first.</Text>
                </View>
            </View>
        )
    }

    function getItem(conditions){
        return conditions.split(' && ')[0].split(/[><]/)[1];
    }

    return (
        <View style={styles.row}>
            <View style={styles.column}>
                <Block color={theme.colors.warning} style={styles.block}>
                    <Text style={styles.columnTitle}>BUY Levels</Text>
                </Block>
                <ScrollView>
                    {
                        props.grids.filter(g => g.orderTemplate.side === 'BUY').map((g, i) => (
                            <ListItem key={"buy" + i} bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{getItem(g.conditions)}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))
                    }
                </ScrollView>
            </View>
            <View style={styles.column}>
                <Block color={theme.colors.success} style={styles.block}>
                    <Text style={styles.columnTitle}>SELL Levels</Text>
                </Block>
                <ScrollView>
                    {
                        props.grids.filter(g => g.orderTemplate.side === 'SELL').map((g, i) => (
                            <ListItem key={"sell" + i} bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{getItem(g.conditions)}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))
                    }
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    empty: {
        marginVertical: 15,
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        flex: 1
    },
    column: {
        flexDirection: 'column',
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 5
    },
    block: {
        height: 30,
        flex: 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        marginHorizontal: 0
    },
    columnTitle: {
        fontWeight: 'bold'
    }
})

export default GridArea;