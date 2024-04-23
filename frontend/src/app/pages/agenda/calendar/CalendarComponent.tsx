import { Calendar, Event } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { addDays, addHours } from "date-fns";
import { daysLocalizer as localizer } from "./getLocalizer";
import { getMessagesES } from "./getMessagesES";
import { useCallback } from "react";

interface Props {
  events: Event[];
}

export const CalendarComponent = ({ events }: Props) => {

  const myEventsList: Event[] = [
    {
      allDay: true,
      title: "All Day 1 very long title",
      start: new Date(),
      end: addHours(new Date(), 3),
      resource: {
        // backgroundColor: "#fafa23",
        priority: "MEDIA",
      },
    },
    {
      title: "All Day 2 very long title",
      start: new Date(),
      end: addHours(new Date(), 3),
      resource: {
        backgroundColor: "#fb87f0",
      },
    },
    {
      title: "All Day 3 very long title",
      start: new Date(),
      end: addHours(new Date(), 3),
      resource: {
        backgroundColor: "#5f0022",
      },
    },
    {
      title: "All Day 4 very long title",
      start: addDays(new Date(), 1),
      end: addDays(new Date(), 3),
      resource: {
        backgroundColor: "#e12230",
      },
    },
  ];

  const eventStyleGetter = (
    event: Event
  ) => {
    enum Priority {
      BAJA = "bg-secondary",
      MEDIA = "bg-primary",
      ALTA = "bg-warning",
      URGENTE = "bg-danger",
    }
    const bg_priority =
      Priority[event.resource.priority as keyof typeof Priority] ||
      "bg-secondary";

    return {
      className: bg_priority,
      style: {
        fontSize: ".8em",
        color: "black",
      },
    };
  };

  const handleDoubleClick = useCallback((event: any) => {
    console.log("handleDoubleClick", event);
  }, []);

  return (
    <>
      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 90px)" }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        popup
        selectable
        timeslots={2}
        step={15}
        onDoubleClickEvent={handleDoubleClick}
      />
    </>
  );
};
