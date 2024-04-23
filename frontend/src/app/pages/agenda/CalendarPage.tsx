import { useEffect, useState } from "react";
import apiSJM from "../../../api/apiSJM";
import { CalendarComponent } from "./calendar";
import { Event } from "react-big-calendar";
import { LoadingSpinner } from "../../components";
import { parseDates } from "./calendar/parseDates";

export const CalendarPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get("/visit_requests/calendar");
      setEvents(parseDates(data.items));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>{loading ? <LoadingSpinner /> : <CalendarComponent events={events} />}</>
  );
};
