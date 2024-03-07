import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme, Overlay, Button } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';

/**
 * props:
 * - type
 * - text
 * - visible
 * - onDismiss
 */
function Toast(props) {

    const { theme } = useTheme();

    const [text, setText] = useState('');
    const [type, setType] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setText(props.text);
        setType(props.type);
        setVisible(props.visible);
    }, [props.type, props.text, props.visible])

    function onDismiss() {
        setVisible(false);
        if (props.onDismiss) props.onDismiss();
    }

    return (
        <Overlay isVisible={visible} onBackdropPress={onDismiss}>
            <View style={styles.logo}>
                {
                    type === 'error'
                        ? <Icon name="alert-triangle" size={32} color={theme.colors.danger} />
                        : <Icon name="alert-circle" size={32} color={theme.colors.success} />
                }
            </View>
            <Text style={{ margin: 10, color: type === 'error' ? theme.colors.danger : theme.colors.success }}>
                {text}
            </Text>
            <Button title="Ok" style={{ marginTop: 10 }} onPress={onDismiss} />
        </Overlay>
    )
}

const styles = StyleSheet.create({
    logo: {
        alignItems: 'center',
        margin: 10
    }
})

export default Toast;