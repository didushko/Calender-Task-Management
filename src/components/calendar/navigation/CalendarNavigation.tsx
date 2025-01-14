"use client";

import styled from "styled-components";
import { ICalendarProps } from "../Calendar";
import { getModeByValue } from "../ViewMode";
import { NagerCountry } from "@/services/nagerDateService";
import NavigationDateSelector from "./NavigationDateSelector";
import NavigationCountrySelector from "./NavigationCountrySelector";
import NavigationViewSelector from "./NavigationViewSelector";
import NavigationSearch from "./NavigationSearch";

interface Iprops extends ICalendarProps {
  countryList?: NagerCountry[] | null;
}
const CalendarNavigation = ({ date, view, countryList }: Iprops) => {
  const viewMode = getModeByValue(view);
  return (
    <StyledNavigation>
      <NavigationCountrySelector countryList={countryList} />
      <NavigationSearch />
      <NavigationDateSelector date={date} viewMode={viewMode} />
      <NavigationViewSelector viewMode={viewMode} />
    </StyledNavigation>
  );
};

export default CalendarNavigation;

export const StyledNavigation = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  background: rgb(255, 156, 0);
  background: radial-gradient(circle, #fdc770 0%, #fff200 100%);
  height: 50px;
  padding: 0 50px;
`;
