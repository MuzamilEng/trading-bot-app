import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

/**
 * props:
 * - onChange
 */
function OperatorSelect(props) {

    const [operator, setOperator] = useState(2);

    function onPress(value) {
        setOperator(value);
        switch (value) {
            case 0: return props.onChange('<');
            case 1: return props.onChange('<=');
            case 2: return props.onChange('==');
            case 3: return props.onChange('!==');
            case 4: return props.onChange('>=');
            case 5: return props.onChange('>');
        }
    }

    return (
        <ButtonGroup
            onPress={onPress}
            selectedIndex={operator}
            containerStyle={styles.group}
            buttons={["<", "<=", "=", "!=", ">=", ">"]} />
    )
}

const styles = StyleSheet.create({
    group: {
        height: 30
    }
})

export default OperatorSelect;