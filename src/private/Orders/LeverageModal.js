import { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme, Overlay, Text, Button } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import { updateFuturesPosition } from '../../services/ExchangeService';
import LeverageInput from '../../components/LeverageInput/LeverageInput';

/**
 * props:
 * - symbol
 * - leverage
 */
function LeverageModal(props) {
    const [symbol, setSymbol] = useState('BTCUSDT');
    const [leverage, setLeverage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { theme } = useTheme();

    useEffect(() => {
        if (props.leverage)
            setLeverage(props.leverage);
    }, [props.leverage])

    useEffect(() => {
        if (props.symbol)
            setSymbol(props.symbol);
    }, [props.symbol])

    function doConfirmPress(evt) {
        setIsLoading(true);
        setError("");
        updateFuturesPosition(symbol, { leverage })
            .then(result => {
                setIsLoading(false);
                setShowModal(false);
            })
            .catch(err => {
                setIsLoading(false);
                setError(err.response ? err.response.data : err.message);
            })
    }

    return (
        <>
            <View style={styles.leverageView}>
                <Text style={styles.label}>Leverage: </Text>
                <Button
                    title={leverage + "x"}
                    titleStyle={styles.selectedLeverage}
                    buttonStyle={styles.leverageButton}
                    type="clear"
                    onPress={evt => setShowModal(true)}
                    icon={<Icon name="edit" size={20} color="black" />}
                    iconRight={true} />
            </View>
            <Overlay overlayStyle={styles.overlay}
                isVisible={showModal}
                onBackdropPress={evt => setShowModal(false)}>
                <Text style={styles.title}>{symbol + " Leverage"}</Text>
                <LeverageInput leverage={leverage} onChange={setLeverage} />
                <Button
                    title=" Confirm"
                    style={styles.confirmButton}
                    onPress={doConfirmPress}
                    icon={isLoading ? <ActivityIndicator /> : <Icon name="save" size={20} color="white" />}
                    iconLeft={true} />
                {
                    error
                        ? <Text style={{ color: theme.colors.danger }}>{error}</Text>
                        : <></>
                }
            </Overlay>
        </>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 0,
        width: '90%'
    },
    p: {
        marginVertical: 5,
        marginHorizontal: 10
    },
    b: {
        fontWeight: 'bold'
    },
    confirmButton: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 10,
        marginVertical: 10
    },
    selectedLeverage: {
        fontWeight: 'normal',
        color: 'black',
        paddingRight: 10
    },
    leverageButton: {
        width: '100%'
    },
    leverageView: {
        flex: 1,
        marginLeft: 10,
        marginBottom: 5,
        alignItems: 'center',
        flexDirection: 'row'
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16
    }
})

export default LeverageModal;