import { getCalendarData } from "../../../lib/utils";
import View from "./View";
import { getModeByValue } from "./ViewMode";

const CalendarGrid = async ({
  date,
  view,
  country,
  search,
}: {
  date?: string;
  view?: string;
  country?: string;
  search?: string;
}) => {
  const calendarData = await getCalendarData(
    date,
    getModeByValue(view),
    country,
    search
  );

  return <View calendarData={calendarData} search={search} selectedDateStr={date} />;
};
export default CalendarGrid;
