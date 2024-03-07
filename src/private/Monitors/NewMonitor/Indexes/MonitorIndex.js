import React, { useState, useEffect } from 'react';
import { getAnalysisIndexes } from '../../../../services/BeholderService';
import Picker from 'react-native-picker-select';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - onChange
 */
function MonitorIndex(props) {

    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState([]);
    const [index, setIndex] = useState('');

    useEffect(() => {
        setIsLoading(true);
        getAnalysisIndexes()
            .then(result => {
                setIsLoading(false);
                setAnalysis(Object.keys(result).sort().map(key => {
                    const obj = result[key];
                    return {
                        key,
                        name: obj.name,
                        params: obj.params !== 'none' ? obj.params : ''
                    }
                }))
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err.response ? err.response.data : err.message);
            })
    }, [])

    function onChange(value) {
        if (!value) return;
        setIndex(value);
        props.onChange(analysis.find(a => a.key === value));
    }

    return (
        <>
            {
                isLoading
                    ? <ActivityIndicator />
                    : <Picker
                        value={index}
                        onValueChange={onChange}
                        useNativeAndroidPickerStyle={false}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                top: 0,
                                right: 12
                            }
                        }}
                        Icon={() => <Icon name="chevron-down" size={24} color="black" />}
                        items={
                            analysis.map(item => {
                                return {
                                    label: item.name,
                                    value: item.key
                                }
                            })
                        } />
            }
        </>
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginBottom: 10,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold',
        color: 'black'
    },
    inputAndroid: {
        marginBottom: 10,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold',
        color: 'black'
    }
})

export default MonitorIndex;