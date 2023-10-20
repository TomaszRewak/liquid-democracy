import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "semantic-ui-react";

function lightText(text) {
    return <span style={{ opacity: 0.3 }}>{text}</span>;
}

function getIntervalString(interval) {
    const seconds = Math.floor(interval / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0)
        return `${weeks}w ${days % 7}d ${hours % 24}h`;

    if (days > 0)
        return `${days}d ${hours % 24}h ${minutes % 60}m`;

    if (hours > 0)
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;

    if (minutes > 0)
        return `${minutes}m ${seconds % 60}s`;

    return `${seconds}s`;
}

function getTimeLabel(now, startTime, endTime) {
    if (now < startTime) {
        return (
            <Fragment>
                starts {lightText('in')} {getIntervalString(startTime - now)}
            </Fragment>
        )
    }

    if (now < endTime) {
        return (
            <Fragment>
                ends {lightText('in')} {getIntervalString(endTime - now)}
            </Fragment>
        )
    }

    return (
        <Fragment>
            ended {getIntervalString(now - endTime)} {lightText('ago')}
        </Fragment>
    )
}

export default function Timer({ startTime, endTime }) {
    const [now, setNow] = useState(Date.now());

    const updateNow = useCallback(() => {
        setNow(Date.now());
    }, []);

    useEffect(() => {
        const interval = setInterval(updateNow, 1000);
        return () => clearInterval(interval);
    }, [updateNow]);

    const timeLabel = useMemo(() => {
        return getTimeLabel(now, startTime, endTime)
    }, [now, startTime, endTime]);

    return (
        <Fragment>
            <Icon name='clock' />
            {timeLabel}
        </Fragment>
    )
}