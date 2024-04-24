import { Calendar, Event } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { daysLocalizer as localizer } from "./getLocalizer";
import { getMessagesES } from "./getMessagesES";
import { useCallback, useEffect, useState } from "react";
import { ModalVisit } from "./ModalVisit";

interface Props {
  events: Event[];
}

enum Priority {
  BAJA = "#B5D6A7",
  MEDIA = "#FFF47A",
  ALTA = "#FD9800",
  URGENTE = "#F55D1E",
}

export const CalendarComponent = ({ events }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const eventStyleGetter = (event: Event) => {
    return {
      style: {
        backgroundColor:
          Priority[event.resource.priority as keyof typeof Priority] || "#fff",
        fontSize: ".8em",
        color: "black",
        padding: "0.2rem",
      },
    };
  };

  const handleDoubleClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  }, []);

  useEffect(() => {
    if (!showModal) setSelectedEvent(null);
  }, [showModal]);

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
        timeslots={1}
        step={60}
        onDoubleClickEvent={handleDoubleClick}
      />

      <ModalVisit
        event={selectedEvent}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
};
