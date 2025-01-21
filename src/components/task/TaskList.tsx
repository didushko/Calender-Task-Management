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
  const updateList = (list: IDailyTaskList["tasks"]) => {
    list.sort((a, b) => a.priority - b.priority);
    dailyTaskList.tasks = list;
    setTaskList(list);
  };
  return (
    <TasksListStyled>
      <HolidayList holidays={dailyTaskList.holidays} day={dailyTaskList.date}/>
      <AddNewTaskButton
        key={taskList.length}
        date={dailyTaskList.date}
        updateList={updateList}
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
  border: 1px solid rgba(107, 107, 107, 0.198);
  border-radius: 5px;
  background-image: linear-gradient(
    to bottom,
    rgba(96, 96, 96, 0.362) 1px,
    transparent 1px
  );
  background-size: 100% 25px;
`;

const TasksListStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 25px);
  gap: 0px;
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

export default TaskList;
