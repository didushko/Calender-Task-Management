"use client";
import { addTaskAction } from "@/actions/taskActions";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

const AddNewTaskLabel = ({
  date,
  cansel,
}: {
  date: Date;
  cansel: () => void;
}) => {
  const [text, setText] = useState("New task");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    cansel();
  };

  const handleSave = async () => {
    setIsLoading(true);
    if (text.length === 0) {
      cansel();
      return;
    }
    const list = await addTaskAction(date, text);
    if (!list) {
      toast.error("Something went wrong, please try again");
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <LabelContainer>
      <NewLabelStyled
        value={text}
        onInput={handleChange}
        onKeyDownCapture={(e) => {
          if (e.key === "Enter") {
            handleSave();
          }
          if (e.key === "Escape") {
            handleDelete();
          }
        }}
        autoFocus
        onBlur={handleSave}
        readOnly={isLoading}
      />
    </LabelContainer>
  );
};

export default AddNewTaskLabel;

const NewLabelStyled = styled.input`
  overflow: hidden;
  width: 80%;
  height: 25px;
  background: transparent;
  font-size: inherit;
  border: none;
  user-select: none;
  &:focus {
    outline: none;
  }
  color: white;
`;

export const LabelContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  margin: 5px 0px;
  align-items: center;
  justify-content: space-around;
  padding: 0px;
  color: black;
  border-radius: 20px;
  overflow: hidden;
  background-color: #127da0;
  border: 1px solid #015b97;
  width: 100%;
`;
