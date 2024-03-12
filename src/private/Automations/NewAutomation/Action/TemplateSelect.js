import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, View } from 'react-native';

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
        <View style={styles.wrapper}>
            <Dropdown
                style={[styles.dropdown, { borderColor: 'gray' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                defaultValue={selected}
                valueField="value"
                labelField={'label'}
                placeholder='Select Type'
                value={selected}
                searchPlaceholder="Search..."
                data={
                    templates.map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    })
                }
                onChange={onChange}
            />
        </View>
    )
}

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

export default TemplateSelect;