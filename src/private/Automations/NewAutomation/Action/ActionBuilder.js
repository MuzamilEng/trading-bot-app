import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme, Button } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import ActionSelect from './ActionSelect';
import TemplateSelect from './TemplateSelect';
import { getAllOrderTemplates } from '../../../../services/OrderTemplatesService';
import { getWithdrawTemplates } from '../../../../services/WithdrawTemplatesService';
import { getSymbol } from '../../../../services/SymbolsService';

/**
 * props:
 * - symbol
 * - onAddAction
 */
function ActionBuilder(props) {

    const { theme } = useTheme();

    const [showBuilder, setShowBuilder] = useState(false);

    const [type, setType] = useState('');
    const [template, setTemplate] = useState({});
    const [isLoaded, setIsLoaded] = useState(0);

    const [orderTemplates, setOrderTemplates] = useState([]);
    const [withdrawTemplates, setWithdrawTemplates] = useState([]);

    useEffect(() => {
        if (!props.symbol) return;

        setIsLoaded(0);

        getAllOrderTemplates(props.symbol)
            .then(ot => {
                setOrderTemplates(ot);
                setIsLoaded(isLoaded + 1);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setIsLoaded(isLoaded + 1);
            })

        getSymbol(props.symbol)
            .then(symbol => getWithdrawTemplates(symbol.base, 1))
            .then(wt => {
                setWithdrawTemplates(wt);
                setIsLoaded(isLoaded + 1);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setIsLoaded(isLoaded + 1);
            })

    }, [props.symbol])

    function onPress() {
        const newAction = { type };
        if (['ORDER', 'TRAILING'].includes(newAction.type)) {
            if (!template) return;
            newAction.id = 'ot' + template.id;
            newAction.orderTemplateId = template.id;
            newAction.orderTemplate = template;
        }
        else if (newAction.type === 'WITHDRAW') {
            if (!template) return;
            newAction.id = 'wt' + template.id;
            newAction.orderTemplateId = template.id;
            newAction.orderTemplate = template;
        }
        else
            newAction.id = newAction.type;

        props.onAddAction(newAction);
        setShowBuilder(false);
    }

    const styles = StyleSheet.create({
        build: {
            marginVertical: 15,
            height: type && type?.indexOf('ALERT') === -1 ? 220 : 150,
            flex: 0
        },
        collapsed: {
            marginVertical: 15,
            height: 80,
            flex: 0
        }
    })

    function renderSelect() {
        if (!type || type?.indexOf('ALERT') !== -1) return <></>;

        if (type === 'WITHDRAW' && isLoaded < 2) return <ActivityIndicator />;

        if (['ORDER', 'TRAILING'].includes(type) && isLoaded < 1) return <ActivityIndicator />;

        return <TemplateSelect
            templates={type === 'WITHDRAW' ? withdrawTemplates : orderTemplates}
            onChange={value => setTemplate(value)} />
    }

    return (
        <>
            {
                showBuilder
                    ? (
                        <View style={{ ...theme.inputContainer, ...styles.build }}>
                            {
                                isLoaded < 1
                                    ? <ActivityIndicator />
                                    : <ActionSelect onChange={setType} />
                            }
                            {renderSelect()}
                            <Button
                                onPress={evt => onPress()}
                                icon={() => <Icon name="plus" color="black" size={20} />}
                                buttonStyle={{ backgroundColor: theme.colors.secondary, marginHorizontal: 10, marginTop: 10 }}
                                title="Add Action" />
                        </View>
                    )
                    : (
                        <View style={{ ...theme.inputContainer, ...styles.collapsed }}>
                            <Button
                                onPress={evt => setShowBuilder(true)}
                                icon={() => <Icon name="plus" color="black" size={20} />}
                                buttonStyle={{ backgroundColor: theme.colors.secondary, marginHorizontal: 10 }}
                                title="Add Action" />
                        </View>
                    )
            }
        </>
    )
}

export default ActionBuilder;