import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MonitorIndex from './MonitorIndex';
import { useTheme, Button, Input } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - onAddIndex
 */
function IndexBuilder(props) {

    const { theme } = useTheme();

    const [showBuilder, setShowBuilder] = useState(false);
    const [index, setIndex] = useState({});
    const [analysis, setAnalysis] = useState({});

    function onChange(analysis) {
        setAnalysis(analysis);
        setIndex({ ...index, key: analysis.key });
    }

    const styles = StyleSheet.create({
        collapsed: {
            marginVertical: 15,
            height: 80,
            flex: 0
        },
        build: {
            marginVertical: 15,
            height: analysis.params ? 220 : 125,
            flex: 0
        },
        button: {
            backgroundColor: theme.colors.secondary,
            marginHorizontal: 10
        }
    })

    function onPress() {
        setShowBuilder(false);
        props.onAddIndex(index);
        setIndex({});
        setAnalysis({});
    }

    return (
        <>
            {
                showBuilder
                    ? (
                        <View style={{ ...theme.inputContainer, ...styles.build }}>
                            <MonitorIndex onChange={onChange} />
                            {
                                analysis.params
                                    ? (
                                        <Input
                                            label="Params:"
                                            placeholder={analysis.params}
                                            keyboardType='decimal-pad'
                                            autoCapitalize='none'
                                            leftIcon={<Icon name="sliders" size={20} color="black" />}
                                            onChangeText={text => setIndex({ ...index, params: text })}
                                            value={index.params} />
                                    )
                                    : <></>
                            }
                            <Button
                                onPress={evt => onPress()}
                                buttonStyle={styles.button}
                                icon={() => <Icon name="plus" size={20} color="black" />}
                                title="Add Index" />
                        </View>
                    )
                    : (
                        <View style={{ ...theme.inputContainer, ...styles.collapsed }}>
                            <Button
                                onPress={evt => setShowBuilder(!showBuilder)}
                                buttonStyle={styles.button}
                                icon={() => <Icon name="plus" size={20} color="black" />}
                                title="Add Index" />
                        </View>
                    )
            }
        </>
    )
}

export default IndexBuilder;