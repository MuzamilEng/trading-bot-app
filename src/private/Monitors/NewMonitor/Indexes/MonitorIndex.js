import React, { useState, useEffect } from 'react';
import { getAnalysisIndexes } from '../../../../services/BeholderService';
import { Dropdown } from 'react-native-element-dropdown';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

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
                    : 
                    <View style={styles.wrapper}>
            <Dropdown
                style={[styles.dropdown, { borderColor: 'gray' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                defaultValue={index}
                valueField="value"
                labelField={'label'}
                placeholder='Select Type'
                value={index}
                searchPlaceholder="Search..."
                data={
                    analysis.map(item => {
                        return {
                            label: item.name,
                            value: item.key
                        }
                    })
                }
                onChange={onChange}
            />
        </View>
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
const styles = StyleSheet.create({
    wrapper: {
        margin: 10,
        paddingTop: 10,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
export default MonitorIndex;