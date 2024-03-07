import { useState, useEffect } from 'react';
import MarginType from "../../components/MarginType/MarginType";
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme, Button, Overlay, Divider } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import { updateFuturesPosition } from '../../services/ExchangeService';

/**
 * props:
 * - symbol
 * - type
 */
function MarginTypeModal(props) {

    const { theme } = useTheme();

    const [symbol, setSymbol] = useState('BTCUSDT');
    const [marginType, setMarginType] = useState('ISOLATED');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (props.type)
            setMarginType(props.type);
    }, [props.type])

    useEffect(() => {
        if (props.symbol)
            setSymbol(props.symbol);
    }, [props.symbol])

    function doConfirmPress(evt) {
        setIsLoading(true);
        setError("");
        updateFuturesPosition(symbol, { marginType })
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
            <View style={styles.marginView}>
                <Text style={styles.label}>Margin: </Text>
                <Button
                    title={marginType.toUpperCase()}
                    titleStyle={styles.selectedMargin}
                    buttonStyle={styles.marginButton}
                    type="clear"
                    onPress={evt => setShowModal(true)}
                    icon={<Icon name="edit" size={20} color="black" />}
                    iconRight={true} />
            </View>
            <Overlay overlayStyle={styles.overlay}
                isVisible={showModal}
                onBackdropPress={evt => setShowModal(false)}>
                <Text style={styles.title}>{symbol + " Perpetual"}</Text>
                <Divider />
                <MarginType type={marginType.toUpperCase()} onChange={setMarginType} />
                <Text style={styles.p}>Switching the margin mode will only apply it to the selected contract.</Text>
                <Divider style={styles.p} />
                <View style={styles.p}>
                    <Text style={styles.b}>Cross Margin Mode:</Text>
                    <Text>All cross positions under the same margin asset share the same asset cross margin balance. In the event of liquidation, your assets full margin balance along with any remaining open positions under the asset may be forfeited.</Text>
                </View>
                <View style={styles.p}>
                    <Text style={styles.b}>Isolated Margin Mode:</Text>
                    <Text>Manage your risk on individual positions by restricting the amount of margin allocated to each. If the margin ratio of a position reached 100%, the position will be liquidated. Margin can be added or removed to positions using this mode.</Text>
                </View>
                <Divider style={styles.p} />
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
    selectedMargin: {
        fontWeight: 'normal',
        color: 'black',
        paddingRight: 10
    },
    marginButton: {
        width: '100%'
    },
    marginView: {
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

export default MarginTypeModal;