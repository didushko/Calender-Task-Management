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
  justify-content: space-around;
  padding: 0px 30px;
  flex-wrap: wrap;
  align-items: center;
  border-image: linear-gradient(50deg, transparent, gray, transparent) 1;
  border-width: 0 0 1px 0;
  border-style: solid;
  font-size: 16px;
  align-content: center;
`;
