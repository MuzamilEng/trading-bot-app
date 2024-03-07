import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - leverage
 * - onChange
 */
function LeverageInput(props) {

    function calcLeverage(inc) {
        const leverage = parseInt(props.leverage);
        props.onChange(`${leverage + inc}`);
    }

    return (
        <Input
            onChangeText={props.onChange}
            keyboardType='number-pad'
            leftIcon={<Icon.Button name="minus" size={24} color="black" iconStyle={styles.calcButton} backgroundColor="transparent" onPress={evt => calcLeverage(-1)} />}
            rightIcon={<Icon.Button name="plus" size={24} color="black" iconStyle={styles.calcButton} backgroundColor="transparent" onPress={evt => calcLeverage(1)} />}
            value={props.leverage + ""} />
    )
}

const styles = StyleSheet.create({
    calcButton: {
        paddingRight: 0,
        marginRight: 0
    }
})

export default LeverageInput;