export function getColorByStatus(status, theme) {
    switch (status) {
        case 'REJECTED':
        case 'CANCELED':
        case 'NEW_INSURANCE':
        case 'NEW_ADL':
        case 'EXPIRED': return theme.colors.danger;
        case 'FILLED': return theme.colors.success;
        case 'PARTIALLY_FILLED': return theme.colors.info;
        default: return theme.colors.warning;
    }
}