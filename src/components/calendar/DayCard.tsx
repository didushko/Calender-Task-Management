"use client";
import styled, { css } from "styled-components";
import TaskList from "../task/TaskList";
import { IDailyTaskList } from "@/database/models/dailyTaskList-model";
import { PublicHoliday } from "@/services/nagerDateService";

interface IProps {
  dailyTaskList: IDailyTaskList & { holidays: PublicHoliday[] };
  currentMonth?: number;
}

const DayCard = ({ dailyTaskList, currentMonth }: IProps) => {
  const isCurrent =
    currentMonth !== undefined
      ? dailyTaskList.date.getMonth() === currentMonth
      : true;
  const firstDayAtMonth = new Date(
    dailyTaskList.date.getFullYear(),
    dailyTaskList.date.getMonth(),
    1
  ).getDate();
  const today = new Date();
  const currendDay = today.getDate() === dailyTaskList.date.getDate();
  const currendDate =
    currendDay && today.getMonth() === dailyTaskList.date.getMonth();
  const lastDayAtMonth = new Date(
    dailyTaskList.date.getFullYear(),
    dailyTaskList.date.getMonth() + 1,
    0
  ).getDate();
  const showMonth =
    dailyTaskList.date.getDate() === firstDayAtMonth ||
    dailyTaskList.date.getDate() === lastDayAtMonth;
  return (
    <ContainerStyled $currentMonth={isCurrent} $currendDay={currendDate}>
      <HeaderStyled>
        <BoldStyled $currentMonth={isCurrent} $currendDay={currendDay}>
          {dailyTaskList.date.getDate()}{" "}
          {showMonth && dailyTaskList.date.toString().split(" ")[1]}
        </BoldStyled>
        {isCurrent && (
          <SpanStyled>
            {dailyTaskList.tasks?.length > 0 &&
              `Task${dailyTaskList.tasks.length > 1 ? "s" : ""}: ${
                dailyTaskList?.tasks.length
              }`}
          </SpanStyled>
        )}
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
  position: relative;
  padding: 5px;
  max-height: calc(100% - 0px);
  overflow: auto;
  font-size: 14px;
  ${(props) =>
    props.$currentMonth
      ? css`
          background-color: #fdfd96;
          border: 1px solid #f5e79e;
        `
      : css`
          background-color: #f4f4d0;
        `}
  ${(props) =>
    props.$currendDay &&
    css`
      background-color: #f2f23e;
      border: 2px solid rgba(204, 80, 8, 0.814);
      border-radius: 0px 5px 10px 10px;
    `}
`;

const BoldStyled = styled.span<{
  $currentMonth?: boolean;
  $currendDay: boolean;
}>`
  font-size: large;
  font-weight: bold;
  padding: 4px;
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
      color: #f40000;
      font-size: x-large;
      font-weight: bold;
    `}
`;

const SpanStyled = styled.span`
  color: #615454;
  font-size: small;
  font-family: math;
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  height: 25px;
`;
