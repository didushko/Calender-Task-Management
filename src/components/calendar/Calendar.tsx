import CalendarNavigation from "./navigation/CalendarNavigation";
import CalendarGrid from "./CalendarGrid";
import nagerDateService from "@/services/nagerDateService";

export interface ICalendarProps {
  date?: string;
  view?: string;
  country?: string;
  search?: string;
}

const Calendar = async ({ date, view, country, search }: ICalendarProps) => {
  const countryList = await nagerDateService.AvaliavleCountries();
  return (
    <div>
      <CalendarNavigation date={date} view={view} countryList={countryList} />
      <CalendarGrid date={date} view={view} country={country} search={search} />
    </div>
  );
};

export default Calendar;
