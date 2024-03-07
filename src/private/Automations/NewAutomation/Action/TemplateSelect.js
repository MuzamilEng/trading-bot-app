import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import Picker from 'react-native-picker-select';

/**
 * props:
 * - templates
 * - onChange
 */
function TemplateSelect(props) {

    const [templates, setTemplates] = useState([]);
    const [selected, setSelected] = useState();

    useEffect(() => {
        setTemplates(props.templates || []);
    }, [props.templates])

    function onChange(value) {
        if (!value) return;
        setSelected(value);
        props.onChange(templates.find(t => t.id === value));
    }

    return (
        <Picker
            value={selected}
            onValueChange={onChange}
            useNativeAndroidPickerStyle={false}
            Icon={() => <Icon name="chevron-down" color="black" size={24} />}
            items={
                templates.map(item => {
                    return {
                        label: item.name,
                        value: item.id
                    }
                })
            }
            style={{
                ...pickerSelectStyles,
                iconContainer: {
                    top: 10,
                    right: 12
                }
            }} />
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginVertical: 15,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold',
        color: 'black'
    },
    inputAndroid: {
        marginVertical: 15,
        height: 30,
        paddingHorizontal: 10,
        fontSize: 16,
        alignItems: 'stretch',
        fontWeight: 'bold',
        color: 'black'
    }
})

export default TemplateSelect;