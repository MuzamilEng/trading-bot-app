import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, Badge } from 'react-native-elements';
import { Feather as Icon } from '@expo/vector-icons';
import { hasAlerts } from '../../services/AlertsService';

/**
 * props:
 * - navigation
 */
function AlertsButton(props) {

    const { theme } = useTheme();

    const [showBadge, setShowBadge] = useState(false);

    useEffect(() => {
        hasAlerts()
            .then(result => setShowBadge(result))
            .catch(err => alert(err.message));
    }, [])

    return (
        <>
            <Icon.Button
                name="bell"
                size={20}
                color="white"
                backgroundColor={theme.colors.primary}
                onPress={evt => props.navigation.navigate('AlertsList')} />
            {
                showBadge
                    ? <Badge status="success" containerStyle={styles.badge} />
                    : <></>
            }
        </>
    )
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: 8,
        right: 20
    }
})

export default AlertsButton;