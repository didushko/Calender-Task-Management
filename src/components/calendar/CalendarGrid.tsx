import { convertToIsoDate, getCalendarData } from "../../../lib/utils";
import { ICalendarProps } from "./Calendar";
import View from "./View";
import { getModeByValue } from "./ViewMode";

const CalendarGrid = async ({
  date,
  view,
  country,
  search,
}: ICalendarProps) => {
  const currentDate = convertToIsoDate(date);

  const calendarData = await getCalendarData(
    currentDate,
    getModeByValue(view),
    country,
    search
  );
  return (
    <View
      calendarData={calendarData}
      currentDate={currentDate}
      search={search}
    />
  );
};
export default CalendarGrid;
