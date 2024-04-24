import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Event } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { daysLocalizer as localizer } from "./getLocalizer";
import { getMessagesES } from "./getMessagesES";
import { ModalVisit } from "./ModalVisit";

interface Props {
  events: Event[];
  refetchEvents?: (limits: MonthsRange) => void;
}

enum Priority {
  BAJA = "#B5D6A7",
  MEDIA = "#FFF47A",
  ALTA = "#FD9800",
  URGENTE = "#F55D1E",
}

type MonthsRange = {
  min: {
    month: number;
    year: number;
  };
  max: {
    month: number;
    year: number;
  };
};

export const CalendarComponent = ({ events, refetchEvents }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [date, setDate] = useState<Date>(new Date());

  const [monthsRange, setMonthsRange] = useState<MonthsRange>(() => {
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    return {
      min: {
        month: currentMonth === 1 ? 12 : currentMonth - 1,
        year: currentMonth === 1 ? currentYear - 1 : currentYear,
      },
      max: {
        month: currentMonth === 12 ? 1 : currentMonth + 1,
        year: currentMonth === 12 ? currentYear + 1 : currentYear,
      },
    };
  });

  const eventStyleGetter = (event: Event) => ({
    style: {
      backgroundColor: Priority[event.resource.priority as keyof typeof Priority] || "#fff",
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

  const handleNavigate = (newDate: Date) => {
    if (newDate.getMonth() !== date.getMonth() || newDate.getFullYear() !== date.getFullYear()) {
      setDate(newDate);
      const newMonth = newDate.getMonth() + 1;
      const newYear = newDate.getFullYear();
      setMonthsRange({
        min: {
          month: newMonth === 1 ? 12 : newMonth - 1,
          year: newMonth === 1 ? newYear - 1 : newYear,
        },
        max: {
          month: newMonth === 12 ? 1 : newMonth + 1,
          year: newMonth === 12 ? newYear + 1 : newYear,
        },
      });

      const mustRefetch = newMonth === monthsRange.min.month || newMonth === monthsRange.max.month;
      if (refetchEvents && mustRefetch) {
        refetchEvents({
          min: {
            month: newMonth === 1 ? 12 : newMonth - 1,
            year: newMonth === 1 ? newYear - 1 : newYear,
          },
          max: {
            month: newMonth === 12 ? 1 : newMonth + 1,
            year: newMonth === 12 ? newYear + 1 : newYear,
          },
        });
      }
    }
  };

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
