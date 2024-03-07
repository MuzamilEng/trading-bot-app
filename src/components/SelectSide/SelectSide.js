import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

/**
 * props:
 * - side
 * - isFuture
 * - onChange
 */
function SelectSide(props) {

    const [side, setSide] = useState(0);
    const [isFuture, setIsFuture] = useState(false);

    useEffect(() => {
        setIsFuture(props.isFuture ? true : false);
    }, [props.isFuture])

    useEffect(() => {
        setSide(props.side.indexOf('BUY') !== -1 ? 0 : 1);
    }, [props.side])

    function onPress(value) {
        setSide(value);
        props.onChange(getSelectedSide(value));
    }

    function getSelectedSide(value) {
        if (value === 0)
            return isFuture ? "BUY / Long" : "BUY";
        else
            return isFuture ? "SELL / Short" : "SELL";
    }

    function getSides(isFuture) {
        return isFuture
            ? ['BUY / Long', 'SELL / Short']
            : ['BUY', 'SELL'];
    }

    return (
        <ButtonGroup
            onPress={onPress}
            selectedIndex={side}
            containerStyle={styles.group}
            buttons={getSides(isFuture)} />
    )
}

const styles = StyleSheet.create({
    group: {
        height: 30
    }
})

export default SelectSide;