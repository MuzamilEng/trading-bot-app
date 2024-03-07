import Picker from "react-native-picker-select";
import { StyleSheet } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - type
 * - onChange
 */
function MarginType(props) {
    return (
        <Picker
            value={props.type}
            onValueChange={props.onChange}
            style={{
                ...pickerSelectStyles,
                iconContainer: {
                    top: 10,
                    right: 12
                }
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => <Icon name="chevron-down" size={24} color="black" />}
            items={[
                { label: 'CROSSED', value: 'CROSSED' },
                { label: 'ISOLATED', value: 'ISOLATED' }
            ]} />
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

export default MarginType;