import { useCallback, useEffect, useState } from "react";
import { Calendar, Event } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { daysLocalizer as localizer } from "./getLocalizer";
import { getMessagesES } from "./getMessagesES";
import { ModalVisit } from "./ModalVisit";
import { getMonthsInterval } from "./months-interval";
import { isSameMonth, isSameYear } from "date-fns";
import { parseDates } from "./parseDates";
import apiSJM from "../../../../api/apiSJM";

interface Props {
  events: Event[];
}

enum Priority {
  BAJA = "#B5D6A7",
  MEDIA = "#FFF47A",
  ALTA = "#FD9800",
  URGENTE = "#F55D1E",
}

type DateRange = {
  from_date: Date;
  to_date: Date;
};

export const CalendarComponent = ({ events = [] }: Props) => {
  const [localEvents, setLocalEvents] = useState<Event[]>(events);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [date, setDate] = useState<Date>(new Date());

  const eventStyleGetter = (event: Event) => ({
    style: {
      backgroundColor:
        Priority[event.resource.priority as keyof typeof Priority] || "#fff",
      fontSize: ".8em",
      color: "black",
      padding: "0.2rem",
    },
  });

  const handleDoubleClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  }, []);

  useEffect(() => {
    if (!showModal) setSelectedEvent(null);
  }, [showModal]);

  const handleNavigate = async (navigate: Date) => {
    if (!isSameMonth(navigate, date) || !isSameYear(navigate, date)) {
      setDate(navigate);
      const interval: DateRange = getMonthsInterval(navigate);

      const refetch: boolean = false;

      if (refetch && interval && interval.from_date && interval.to_date) {
        const { data } = await apiSJM.get("/visit_requests/calendar/paginated", { params: interval });
        setLocalEvents(parseDates(data.items));
      }
    }
  };

  return (
    <>
      <Calendar
        culture="es"
        localizer={localizer}
        events={localEvents}
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
        onNavigate={handleNavigate}
      />

      <ModalVisit
        event={selectedEvent}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
};
