// DATE-FNS LOCALIZER
import { dateFnsLocalizer as dateFNSLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import esES from "date-fns/locale/es";

// DAYJS LOCALIZER
import { dayjsLocalizer as dayJSLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/es";

export const datefnsLocalizer = dateFNSLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { "es": esES }
});

dayjs.locale("es");
export const daysLocalizer = dayJSLocalizer(dayjs);