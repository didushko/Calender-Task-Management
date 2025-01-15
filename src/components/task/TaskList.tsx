"use client";
import styled from "styled-components";
import TaskLabelEditable from "./TaskLabelEditable";
import { IDailyTaskList } from "@/database/models/dailyTaskList-model";
import { useState } from "react";
import AddNewTaskButton from "./AddNewTaskButton";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { PublicHoliday } from "@/services/nagerDateService";
import HolidayList from "./HolidayList";

const TaskList = ({
  dailyTaskList,
}: {
  dailyTaskList: IDailyTaskList & { holidays: PublicHoliday[] };
}) => {
  const [taskList, setTaskList] = useState(dailyTaskList.tasks);
  return (
    <TasksListStyled>
      <HolidayList holidays={dailyTaskList.holidays} />
      <AddNewTaskButton
        key={taskList.length}
        date={dailyTaskList.date}
        updateList={setTaskList}
      />
      <Droppable droppableId={dailyTaskList._id} type="taskList">
        {(provided) => (
          <DroppableStyled {...provided.droppableProps} ref={provided.innerRef}>
            {provided.placeholder}
            {taskList
              .filter((t) => t?.task)
              .sort((a, b) => a.priority - b.priority)
              .map((taskL) => (
                <Draggable
                  key={taskL._id + taskL.priority}
                  draggableId={taskL.task._id}
                  index={taskL.priority}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <TaskLabelEditable
                        key={taskL._id}
                        task={taskL.task}
                        date={dailyTaskList.date}
                        deleteTask={() =>
                          setTaskList(
                            taskList.filter((t) => t._id !== taskL._id)
                          )
                        }
                      />
                    </div>
                  )}
                </Draggable>
              ))}
          </DroppableStyled>
        )}
      </Droppable>
    </TasksListStyled>
  );
};

const DroppableStyled = styled.div`
  width: 100%;
  flex-grow: 1;
  padding-bottom: 50px;
`;

const TasksListStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  height: calc(100% - 25px);
  gap: 5px;
  scrollbar-color: rgba(10, 27, 220, 0.5) #0072f5;
  border: 1px solid rgba(200, 200, 200, 0.3);
  border-radius: 5px;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.03) 1px,
    transparent 1px
  );
  background-size: 100% 22px;
`;

export default TaskList;
