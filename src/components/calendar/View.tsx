"use client";
import styled, { css } from "styled-components";
import DayCard from "./DayCard";
import { IDailyTaskList } from "@/database/models/dailyTaskList-model";
import {
  DragDropContext,
  DraggableLocation,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { updateTaskListsAction } from "@/actions/dailyListAction";
import { findDayDataById, parseStringToDate } from "../../../lib/utils";
import toast from "react-hot-toast";
import { PublicHoliday } from "@/services/nagerDateService";

export interface CalendarData {
  weekData: {
    dayData: IDailyTaskList & { holidays: PublicHoliday[] };
    key: string;
  }[];
  key: string;
}

const View = ({
  calendarData,
  selectedDateStr,
  search,
}: {
  selectedDateStr?: string;
  calendarData: CalendarData[];
  search?: string;
}) => {
  const selectedDate = parseStringToDate(selectedDateStr);
  const handleDragEnd: OnDragEndResponder = async (results) => {
    const { destination, source } = results;
    if (search) toast.error("Tasks cannot be moved during a search");
    if (!destination) return;
    moveTask(calendarData, destination, source);
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StyledTable>
        <thead>
          <tr>
            {calendarData[0].weekData.map((day) => (
              <th key={calendarData[0].key + day.key}>
                {day.dayData.date.toString().split(" ")[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarData.map((week) => (
            <tr key={week.key}>
              {week.weekData.map((day, i) => (
                <StyledTd
                  key={week.key + day.key}
                  $smallView={week.weekData.length < 6 && i !== 1}
                >
                  <DayCard
                    selectedDate={selectedDate}
                    key={week.key + day.key}
                    dailyTaskList={day.dayData}
                    showCurrentMonth={calendarData.length > 1 ? true : false}
                  />
                </StyledTd>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </DragDropContext>
  );
};

export default View;

async function moveTask(
  data: CalendarData[],
  destination: DraggableLocation<string>,
  source: DraggableLocation<string>
) {
  const targetDay = findDayDataById(data, destination.droppableId);
  const sourceDay = findDayDataById(data, source.droppableId);
  if (!targetDay || !sourceDay) {
    toast.error("Error when drop task, please try again");
    return;
  }
  const task = sourceDay.dayData.tasks.splice(source.index, 1)[0];
  targetDay.dayData.tasks.splice(destination.index, 0, task);

  sourceDay.dayData.tasks.forEach((task, i) => {
    task.priority = i;
  });
  if (source.droppableId !== destination.droppableId) {
    targetDay.dayData.tasks.forEach((task, i) => {
      task.priority = i;
    });
  }

  const res = await updateTaskListsAction([
    sourceDay.dayData,
    targetDay.dayData,
  ]);
  if (res?.some((res) => !res)) {
    toast.error("Error when move task, please update page to reload data");
  }
  return data;
}

export const StyledTd = styled.td<{ $smallView: boolean }>`
  padding: 0px;
  ${(props) =>
    props.$smallView &&
    css`
      border: none;
      padding: 50px;
    `}
`;

export const StyledTable = styled.table`
  width: 100%;
  height: calc(100dvh - 50px);
  padding: 0px 10px;
  table-layout: fixed;
  border-spacing: 5px;
  thead {
    color: #ffffff;
    font-size: small;
    th {
      padding: 10px;
      width: calc(100% / 7);
      font-family: ui-monospace;
    }
  }
  tbody {
    tr,
    td {
      border-collapse: collapse;
      overflow: auto;
      border-radius: 0px 0px 10px 10px;
    }
  }
`;
