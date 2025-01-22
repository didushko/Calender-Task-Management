"use client";
import styled, { css } from "styled-components";
import TaskList from "../task/TaskList";
import { IDailyTaskList } from "@/database/models/dailyTaskList-model";
import { PublicHoliday } from "@/services/nagerDateService";

interface IProps {
  dailyTaskList: IDailyTaskList & { holidays: PublicHoliday[] };
  showCurrentMonth?: boolean;
  selectedDate: Date;
}

const DayCard = ({ dailyTaskList, showCurrentMonth, selectedDate }: IProps) => {
  const today = new Date();
  const isCurrentMonth = showCurrentMonth
    ? dailyTaskList.date.getMonth() === selectedDate.getMonth()
    : true;

  const firstDayAtMonth = new Date(
    dailyTaskList.date.getFullYear(),
    dailyTaskList.date.getMonth(),
    1
  ).getDate();

  const isCurrendDate = today.getDate() === dailyTaskList.date.getDate();

  const isToday =
    isCurrendDate &&
    today.getMonth() === dailyTaskList.date.getMonth() &&
    today.getFullYear() === dailyTaskList.date.getFullYear();

  const lastDayAtMonth = new Date(
    dailyTaskList.date.getFullYear(),
    dailyTaskList.date.getMonth() + 1,
    0
  ).getDate();

  const showMonth =
    dailyTaskList.date.getDate() === firstDayAtMonth ||
    dailyTaskList.date.getDate() === lastDayAtMonth;

  return (
    <ContainerStyled $currentMonth={isCurrentMonth} $currendDay={isToday}>
      <HeaderStyled>
        <BoldStyled $currentMonth={isCurrentMonth} $currendDay={isCurrendDate}>
          {dailyTaskList.date.getDate()}{" "}
          {showMonth && dailyTaskList.date.toString().split(" ")[1]}
        </BoldStyled>
        {
          <SpanStyled>
            {dailyTaskList.tasks?.filter((t) => t?.task).length > 0 &&
              `Task${
                dailyTaskList.tasks.filter((t) => t?.task).length > 1 ? "s" : ""
              }: ${dailyTaskList?.tasks.filter((t) => t?.task).length}`}
          </SpanStyled>
        }
      </HeaderStyled>
      <TaskList dailyTaskList={dailyTaskList} />
    </ContainerStyled>
  );
};

export default DayCard;

export const SceletonDayCard = () => {
  return (
    <ContainerStyled
      style={{ filter: "blur(25px)" }}
      $currentMonth={false}
      $currendDay={false}
    >
      <HeaderStyled>
        <BoldStyled $currentMonth={false} $currendDay={false}>
          {" "}
        </BoldStyled>
      </HeaderStyled>
      <TaskList
        dailyTaskList={{
          _id: "scel",
          tasks: [],
          holidays: [],
          date: new Date(),
        }}
      />
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div<{
  $currentMonth?: boolean;
  $currendDay: boolean;
}>`
  width: 100%;
  height: 100%;
  padding: 5px;
  max-height: calc(100% - 0px);
  overflow: auto;
  font-size: 14px;
  border-radius: 0px 5px 10px 10px;
  ${(props) =>
    props.$currentMonth
      ? css`
          background-color: #f7d482;
        `
      : css`
          background-color: #4c4c4b;
        `}
  ${(props) =>
    props.$currendDay &&
    css`
      background-color: #f7d470;
      border-radius: 0px 5px 10px 10px;
    `}
`;

const BoldStyled = styled.span<{
  $currentMonth?: boolean;
  $currendDay: boolean;
}>`
  font-size: large;
  font-weight: bold;
  font-size: 16px;
  margin: 2px;
  font-family: cursive;
  ${(props) =>
    props.$currentMonth
      ? css`
          color: black;
        `
      : css`
          color: rgb(200, 200, 200);
        `}
  ${(props) =>
    props.$currendDay &&
    css`
      color: #000000;
      font-size: x-large;
      font-weight: bold;
    `}
`;

const SpanStyled = styled.span`
  color: #333232;
  font-size: small;
  font-family: math;
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  height: 20px;
`;
