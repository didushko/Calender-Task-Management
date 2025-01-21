"use client";
import { PublicHoliday } from "@/services/nagerDateService";
import styled from "styled-components";

const HolidayList = ({
  holidays,
  day,
}: {
  holidays: PublicHoliday[];
  day: Date;
}) => {
  if (holidays.length === 0) return null;
  return (
    <Container>
      {holidays
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((holiday) => (
          <HolidayLabelStyled key={holiday.name}>
            <Label>
              {holiday.name}
              <Tooltip $right={day.getDay() === 6}>{holiday.name}</Tooltip>
            </Label>
          </HolidayLabelStyled>
        ))}
    </Container>
  );
};

export default HolidayList;

const Container = styled.div`
  width: 100%;
  display: flex;
  margin: 2px;
  flex-direction: column;
  /* overflow: auto; */
  gap: 5px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.5) transparent;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const HolidayLabelStyled = styled.div`
  min-height: fit-content;
  width: 100%;
  padding: 2px 10px;
  color: black;
  border-radius: 20px;
  overflow: hidden;
  background-color: #ef476f;
  border: 1px solid red;
`;

const Label = styled.div`
  line-height: 12px;
  vertical-align: middle;
  height: 12px;
  min-height: 12px;
  background: transparent;
  border: none;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
`;

const Tooltip = styled.span<{ $right: boolean }>`
  visibility: hidden;
  width: 100%;
  height: 100%;
  background-color: black;
  color: #fff;
  padding: 10%;
  position: absolute;
  z-index: 1;
  top: 0%;
  left: ${({ $right }) => ($right ? "-101%" : "101%")};
  opacity: 0;
  overflow: auto;
  border-radius: 10px;
  white-space: normal;
  word-wrap: break-word;
  background-color: #ef476f;
  border: 1px solid #ef476f;
  color: black;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.03) 1px,
    transparent 1px
  );
  background-size: 100% 22px;
  backdrop-filter: blur(5px);
  transition: visibility 0.3, opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  ${Label}:hover & {
    visibility: visible;
    opacity: 1;
    transition: visibility 1s 1s, opacity 2s 1s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
