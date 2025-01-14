"use client";
import { PublicHoliday } from "@/services/nagerDateService";
import styled from "styled-components";

const HolidayList = ({ holidays }: { holidays: PublicHoliday[] }) => {
  return (
    <Container>
      {holidays.map((holiday) => (
        <HolidayLabelStyled key={holiday.name}>
          <Label>
            {holiday.name}
            <Tooltip>{holiday.name}</Tooltip>
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
  flex-wrap: wrap;
  gap: 5px;
`;

const HolidayLabelStyled = styled.div`
  margin: 5px 0px;
  align-items: center;
  justify-content: space-around;
  padding: 0px 10px;
  color: black;
  border-radius: 20px;
  overflow: hidden;
  background-color: #ff00008c;
  border: 1px solid red;
`;

const Label = styled.div`
  line-height: 20px;
  vertical-align: middle;
  height: 20px;
  min-height: 20px;
  background: transparent;
  border: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
`;

const Tooltip = styled.span`
  visibility: hidden;
  width: 80%;
  height: 80%;
  background-color: black;
  color: #fff;
  padding: 10%;
  position: absolute;
  z-index: 1;
  top: 10%;
  left: 10%;
  opacity: 0;
  overflow: auto;
  border-radius: 10px;
  white-space: normal;
  word-wrap: break-word;
  background-color: #ff0000f1;
  border: 1px solid #f5e79e;
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
