import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Block from '../Block/Block';
import { useTheme } from 'react-native-elements';

/**
 * props:
 * - color
 * - title
 * - text
 */
function InfoBlock(props) {

    const { theme } = useTheme();

    return (
        <Block color={theme.colors[props.color]} style={styles.block}>
            <Text style={styles.bold}>{props.title}</Text>
            <Text style={{ color: 'white' }}>{props.text}</Text>
        </Block>
    )
}

const styles = StyleSheet.create({
    block: {
        alignItems: 'center'
    },
    bold: {
        fontWeight: 'bold',
        color: 'white'
    }
})

export default InfoBlock;