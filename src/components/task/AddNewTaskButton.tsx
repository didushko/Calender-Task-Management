"use client";
import { useState } from "react";
import AddNewTaskLabel from "./AddNewTaskLabel";
import styled from "styled-components";
import { ITask } from "@/database/models/task-model";

const AddNewTaskButton = ({ date, addTask }: { date: Date, addTask: (newItem: ITask)=>void }) => {
  const [edit, setEdit] = useState(false);
  if (edit) {
    return <AddNewTaskLabel date={date} cansel={() => setEdit(false)} addTask={addTask} />;
  }
  return (
    <div>
      <AddButtonStyled onClick={() => setEdit(true)}></AddButtonStyled>
    </div>
  );
};

export default AddNewTaskButton;

const AddButtonStyled = styled.button`
  cursor: copy;
  background-image: url("/edit_square.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  background-position: center;
  border: none;
  background-color: transparent;
  height: 20px;
  width: 20px;
`;
