import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, Button } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import IndexSelect from './IndexSelect';
import OperatorSelect from './OperatorSelect';
import VariableInput from './VariableInput';

/**
 * props:
 * - indexes
 * - onAddCondition
 */
function ConditionBuilder(props) {

    const { theme } = useTheme();

    const [showBuilder, setShowBuilder] = useState(false);
    const [indexes, setIndexes] = useState([]);
    const [index, setIndex] = useState({ example: '', eval: '' });
    const [operator, setOperator] = useState('==');
    const [value, setValue] = useState('');

    useEffect(() => {
        setIndexes(props.indexes || []);
    }, [props.indexes])

    function onIndexChange(index) {
        setIndex(index);
        setValue(index.example);
    }

    function onPress() {
        if (!index.eval || !operator || value === undefined) return;
        props.onAddCondition(`${index.eval}${operator}${value}`);
        setShowBuilder(false);
    }

    return (
        <>
            {
                showBuilder
                    ? (
                        <View style={{ ...theme.inputContainer, ...styles.build }}>
                            <IndexSelect indexes={indexes} onChange={ix => onIndexChange(ix)} />
                            <OperatorSelect onChange={op => setOperator(op)} />
                            <VariableInput value={index.example} indexes={indexes} onChange={value => setValue(value)} />
                            <Button
                                onPress={evt => onPress()}
                                icon={() => <Icon name="plus" color="black" size={20} />}
                                buttonStyle={{ backgroundColor: theme.colors.secondary, marginHorizontal: 10 }}
                                title="Add Condition" />
                        </View>
                    )
                    : (
                        <View style={{ ...theme.inputContainer, ...styles.collapsed }}>
                            <Button
                                onPress={evt => setShowBuilder(true)}
                                icon={() => <Icon name="plus" color="black" size={20} />}
                                buttonStyle={{ backgroundColor: theme.colors.secondary, marginHorizontal: 10 }}
                                title="Add Condition" />
                        </View>
                    )
            }
        </>
    )
}

const styles = StyleSheet.create({
    build: {
        marginVertical: 15,
        height: 240,
        flex: 0
    },
    collapsed: {
        marginVertical: 15,
        height: 80,
        flex: 0
    }
})

export default ConditionBuilder;