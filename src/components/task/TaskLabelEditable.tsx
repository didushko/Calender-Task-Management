"use client";
import { deleteTaskAction, editTaskAction } from "@/actions/taskActions";
import { ITask } from "@/database/models/task-model";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

const TaskLabelEditable = ({
  task,
  date,
  deleteTask,
}: {
  task: ITask;
  date: Date;
  deleteTask: () => void;
}) => {
  const [text, setText] = useState(task.title);
  const [isEditing, setIsEditing] = useState(false);
  const [prevText, setPrevText] = useState(task.title);

  const handleDoubleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      setPrevText(text);
    }
  };

  const handleDelete = async () => {
    if (isEditing) {
      setIsEditing(false);
      setText(prevText);
      return;
    }
    const res = await deleteTaskAction(date, task._id);
    if (!res) {
      toast.error("Something went wrong, please try again");
    } else {
      deleteTask();
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    let res = false;
    const isSaved = await editTaskAction(date, {
      _id: task._id,
      title: text,
    });
    res = !!isSaved;
    if (!res) {
      setText(prevText);
      toast.error("Something went wrong, please try again");
    } else {
      setPrevText(text);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <LabelContainer>
      {isEditing ? (
        <EditableLabelStyled
          value={text}
          onInput={handleChange}
          onKeyDownCapture={(e) => {
            if (isEditing) {
              if (e.key === "Enter") {
                handleSave();
              }
              if (e.key === "Escape") {
                setText(prevText);
                setIsEditing(false);
              }
            }
          }}
          autoFocus
          onBlur={handleSave}
          readOnly={!isEditing}
        />
      ) : (
        <LabelStyled onDoubleClick={handleDoubleClick}>
          {text}
          <Tooltip>{text}</Tooltip>
        </LabelStyled>
      )}
      <DeleteIcon onClick={handleDelete} />
    </LabelContainer>
  );
};

export default TaskLabelEditable;

const LabelContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  margin: 5px 0px;
  align-items: center;
  justify-content: space-around;
  padding: 0px;
  color: black;
  border-radius: 20px;
  overflow: hidden;
  background-color: #006eb7;
  width: 100%;
`;

export const DeleteIcon = styled.div`
  background-image: url("/deleteIcon.png");
  width: 15px;
  height: 15px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  background-position: center;
  cursor: auto;
`;

const EditableLabelStyled = styled.input`
  overflow: hidden;
  width: 80%;
  height: 25px;
  background: transparent;
  font-size: inherit;
  border: none;
  user-select: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  color: black;
`;

const LabelStyled = styled.div`
  line-height: 20px;
  vertical-align: middle;
  width: 80%;
  max-width: 80%;
  height: 20px;
  min-height: 20px;
  background: transparent;
  border: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  background-color: #fdfd96;
  border: 1px solid #030200;
  color: black;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.03) 1px,
    transparent 1px
  );
  background-size: 100% 22px;
  transition: visibility 1s, opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
  ${LabelStyled}:hover & {
    visibility: visible;
    opacity: 1;
    transition: visibility 1s 1s, opacity 2s 1s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
