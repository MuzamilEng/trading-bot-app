import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { Input } from 'react-native-elements';
import { StyleSheet } from 'react-native';

/**
 * props:
 * - schedule
 * - onChange
 */
function ScheduleInput(props) {

    const [schedule, setSchedule] = useState('');
    const [isCron, setIsCron] = useState(false);

    function verifyCron(schedule) {
        return /^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/.test(schedule);
    }

    function verifyDate(schedule) {
        //yyyy-mm-ddThh:mm:ss.mmmZ
        return /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)$/.test(schedule);
    }

    function formatDate(isoDate) {
        const splitParts = isoDate.split('T');
        const splitDate = splitParts[0].split('-');
        const time = splitParts[1].replace('.000Z', '');
        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]} ${time}`;
    }

    function unformatDate(text) {
        if (text.indexOf('/') === -1 || text.length < 10) return text;

        const split = text.split('/');
        const day = split[0];
        const month = split[1];
        const year = split[2].split(' ')[0];

        if (text.indexOf(' ') === -1 || text.length < 19) return text;

        const split2 = text.split(' ')[1].split(':');
        const hour = split2[0];
        const minute = split2[1];
        const second = split2[2];
        return `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
    }

    useEffect(() => {
        if (!props.schedule) return;

        if (verifyDate(props.schedule))
            setSchedule(formatDate(props.schedule));
        else
            setSchedule(props.schedule);
    }, [props.schedule])

    useEffect(() => {
        if (!props.schedule || verifyDate(props.schedule))
            setIsCron(false);
        else if (verifyCron(props.schedule))
            setIsCron(true);
    }, [])

    function getLabel() {
        return isCron ? 'Schedule by Cron:' : 'Schedule by Date:';
    }

    function getPlaceholder() {
        return isCron ? '* * * * *' : 'dd/mm/yyyy hh:mm:ss';
    }

    function getKeyboard() {
        return isCron ? 'default' : 'numeric';
    }

    function onScheduleByClick() {
        setSchedule('');
        setIsCron(!isCron);
        props.onChange('');
    }

    function onChangeText(text) {
        if (!isCron) {
            const chars = text.split('');
            const lastChar = chars[chars.length - 1];

            if (text.length === 3 && !text.endsWith('/')) text = text.substring(0, 2) + "/" + lastChar;
            else if (text.length === 6 && !text.endsWith('/')) text = text.substring(0, 5) + "/" + lastChar;
            else if (text.length === 11 && !text.endsWith(' ')) text = text.substring(0, 10) + " " + lastChar;
            else if (text.length === 14 && !text.endsWith(':')) text = text.substring(0, 13) + ":" + lastChar;
            else if (text.length === 17 && !text.endsWith(':')) text = text.substring(0, 16) + ":" + lastChar;
            else if (text.length > 19) text = text.substring(0, 19);

            const date = unformatDate(text);
            props.onChange(date);
        }
        else
            props.onChange(text);

        setSchedule(text);
    }

    return (
        <>
            <Input
                label={getLabel()}
                placeholder={getPlaceholder()}
                keyboardType={getKeyboard()}
                leftIcon={<Icon.Button name="refresh-cw" size={24} color="black" iconStyle={styles.button} backgroundColor="transparent" onPress={evt => onScheduleByClick()} />}
                value={schedule}
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

export default ScheduleInput;