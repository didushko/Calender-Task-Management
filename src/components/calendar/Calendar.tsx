import CalendarNavigation from "./navigation/CalendarNavigation";
import CalendarGrid from "./CalendarGrid";
import nagerDateService from "@/services/nagerDateService";
import { Suspense } from "react";
import ViewSceleton from "./ViewSceleton";
import { StyledCalendarContainer } from "./View";

export interface ICalendarProps {
  date?: string;
  view?: string;
  country?: string;
  search?: string;
}

const Calendar = async ({ date, view, country, search }: ICalendarProps) => {
  const countryList = await nagerDateService.AvaliavleCountries();
  return (
    <StyledCalendarContainer>
      <CalendarNavigation date={date} view={view} countryList={countryList} />
      <Suspense key={date || "" + view + country} fallback={<ViewSceleton />}>
        <CalendarGrid
          date={date}
          view={view}
          country={country}
          search={search}
        />
      </Suspense>
    </StyledCalendarContainer>
  );
};

export default Calendar;
