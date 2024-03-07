import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { Input } from 'react-native-elements';
import { StyleSheet } from 'react-native';

/**
 * props:
 * - timestamp
 * - label
 * - onChange
 */
function DateInput(props) {

    const [date, setDate] = useState('');

    useEffect(() => {
        if (!props.timestamp) return;
        const isoDate = new Date(props.timestamp).toISOString();
        const splitParts = isoDate.split('T');
        const splitDate = splitParts[0].split('-');
        setDate(`${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`);
    }, [props.timestamp])

    function unformatDate(text) {
        if (text.indexOf('/') === -1 || text.length < 10) return text;

        const split = text.split('/');
        const day = split[0];
        const month = split[1];
        const year = split[2].split(' ')[0];

        return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    }

    function onChangeText(text) {
        const chars = text.split('');
        const lastChar = chars[chars.length - 1];

        if (text.length === 3 && !text.endsWith('/')) text = text.substring(0, 2) + "/" + lastChar;
        else if (text.length === 6 && !text.endsWith('/')) text = text.substring(0, 5) + "/" + lastChar;
        else if (text.length > 10) text = text.substring(0, 10);

        const date = unformatDate(text);
        if (date instanceof Date)
            props.onChange(date.getTime());

        setDate(text);
    }

    return (
        <>
            <Input
                label={props.label}
                placeholder="dd/mm/yyyy"
                keyboardType="numeric"
                leftIcon={<Icon name="calendar" size={24} color="black" iconStyle={styles.button} backgroundColor="transparent" />}
                value={date.substring(0, 10)}
                onChangeText={onChangeText} />
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingRight: 0,
        marginRight: 0
    }
})

export default DateInput;