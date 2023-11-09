import { parseISO, formatDistanceToNow } from "date-fns";

interface timeAgoProps {
    timestamp: string
}

const TimeAgo = ( props: { timestamp: string}) => {
    let timeAgo: string = '';
    if(props.timestamp) {
        const date = parseISO(props.timestamp);
        const timePeriod = formatDistanceToNow(date);
        timeAgo = `${timePeriod} ago`
    }

    return ( 
        <span title={props.timestamp}>
            &nbsp; <i>{timeAgo}</i>
        </span>
    )
}

export default TimeAgo