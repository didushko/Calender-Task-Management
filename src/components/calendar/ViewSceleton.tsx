"use client";
import { DragDropContext } from "@hello-pangea/dnd";
import { SceletonDayCard } from "./DayCard";
import { StyledTable, StyledTd } from "./View";

const ViewSceleton = () => {
  const calendarData: [][] = new Array(5).fill(new Array(7).fill(new Date()));
  return (
    <StyledTable>
      <thead>
        <tr>
          <th> Sun </th>
          <th> Mon </th>
          <th> Tue </th>
          <th> Wed </th>
          <th> Thu </th>
          <th> Fri </th>
          <th> Sat </th>
        </tr>
      </thead>
      <tbody>
        <DragDropContext onDragEnd={() => {}}>
          {calendarData.map((week, i) => (
            <tr key={i}>
              {week.map((day, i) => (
                <StyledTd key={i} $smallView={false}>
                  <SceletonDayCard />
                  <div>d</div>
                </StyledTd>
              ))}
            </tr>
          ))}
        </DragDropContext>
      </tbody>
    </StyledTable>
  );
};

export default ViewSceleton;
