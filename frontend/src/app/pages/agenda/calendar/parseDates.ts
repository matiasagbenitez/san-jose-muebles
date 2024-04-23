import { Event } from "react-big-calendar";
import { parseISO } from "date-fns";

export const parseDates = (events: any[]): Event[] => {
    return events.map(event => {

        event.start = parseISO(event.start);
        event.end = parseISO(event.end);

        return event;
    })
}