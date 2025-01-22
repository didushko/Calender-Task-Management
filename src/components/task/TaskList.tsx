"use client";
import styled from "styled-components";
import TaskLabelEditable from "./TaskLabelEditable";
import { IDailyTaskList } from "@/database/models/dailyTaskList-model";
import AddNewTaskButton from "./AddNewTaskButton";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { PublicHoliday } from "@/services/nagerDateService";
import HolidayList from "./HolidayList";
import { useOptimistic } from "react";
import { ITask } from "@/database/models/task-model";

const TaskList = ({
  dailyTaskList,
}: {
  dailyTaskList: IDailyTaskList & { holidays: PublicHoliday[] };
}) => {
  const [optimisticTaskList, setOptimisticTaskList] = useOptimistic(
    dailyTaskList.tasks.filter((t) => t?.task),
    (prev, next: ITask & { action: "delete" | "add" }) => {
      const { action, ...task } = next;
      if (action === "delete") {
        return prev.filter((t) => t.task._id !== task._id);
      }
      if (action === "add") {
        return [
          { _id: "new", task, priority: 0 },
          ...prev.map((t) => ({ ...t, priority: t.priority + 1 })),
        ];
      }
      return prev;
    }
  );
  return (
    <TasksListStyled>
      <HolidayList holidays={dailyTaskList.holidays} day={dailyTaskList.date} />
      <AddNewTaskButton
        key={optimisticTaskList.length}
        date={dailyTaskList.date}
        addTask={(task: ITask) => {
          setOptimisticTaskList({ ...task, action: "add" });
        }}
      />
      <Droppable droppableId={dailyTaskList._id} type="taskList">
        {(provided) => (
          <DroppableStyled {...provided.droppableProps} ref={provided.innerRef}>
            {provided.placeholder}
            {optimisticTaskList
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
                        deleteItem={(deleteItem: ITask) =>
                          setOptimisticTaskList({
                            ...deleteItem,
                            action: "delete",
                          })
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
  align-items: flex-end;
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
