"use client";
import styled, { css, keyframes } from "styled-components";
import { getModesToDisplay, ViewMode } from "../ViewMode";
import useStateInParam from "@/hooks/useParamChanger";

const CalendarViewSelector = ({ viewMode }: { viewMode: ViewMode }) => {
  const [selectedView, setSelectedView, , isLoading] = useStateInParam(
    "view",
    viewMode.value,
    (view) => view !== "default"
  );

  return (
    <MultitabsStyled $loading={isLoading}>
      {getModesToDisplay().map(({ value, label }) => (
        <TabStyled
          $selected={value === selectedView}
          key={value}
          onClick={() => setSelectedView(value)}
        >
          {label}
        </TabStyled>
      ))}
    </MultitabsStyled>
  );
};

export default CalendarViewSelector;

const MultitabsStyled = styled.div<{
  $loading?: boolean;
}>`
  cursor: pointer;
  margin-left: auto;
  display: flex;
  height: auto;
  flex-wrap: wrap;
  gap: 0px;
  align-items: center;
  color: #000;
  border: 1px solid rgba(174, 174, 174, 0.3);
  border-radius: 20px;
  :first-child {
    border-radius: 20px 0px 0px 20px;
  }
  :last-child {
    border-radius: 0px 20px 20px 0px;
  }
  ${(props) =>
    props.$loading &&
    css`
      animation: ${snakeAnimation} 2s linear infinite;
    `}
`;

const TabStyled = styled.button<{
  $selected?: boolean;
}>`
  background: none;
  color: inherit;
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  flex-grow: 1;
  display: flex;
  min-width: 70px;
  background-color: rgba(5, 5, 30, 0.6);
  padding: 10px 5px 10px 5px;
  justify-content: center;
  border: 1px solid rgba(174, 174, 174, 0.3);
  &:focus {
    border: 1px rgba(0, 0, 255, 0.3) solid;
  }
  ${(props) =>
    props.$selected
      ? css`
          background-color: #000;
          background-color: rgba(5, 5, 30, 0.8);
          color: rgb(233, 234, 237);
          text-shadow: 0px 0px 10px #000;
          box-shadow: 3px 3px 10px rgba(255, 215, 0, 0.1),
            -4px -4px 10px rgba(0, 87, 184, 0.2);
        `
      : css`
          &:hover {
            border: 1px solid rgba(174, 174, 174, 0.3);
            box-shadow: 3px 3px 10px rgba(255, 215, 0, 0.1),
              -4px -4px 10px rgba(0, 87, 184, 0.2);
            color: white;
          }
        `}
`;
const snakeAnimation = keyframes`
  0% {
    box-shadow: 3px 3px 25px rgba(255, 215, 0, 1),
      -3px -3px 25px rgba(0, 87, 184, 1);
  }
  25% {
    box-shadow: 3px -3px 25px rgba(255, 215, 0, 1),
      -3px 3px 25px rgba(0, 87, 184, 1);
  }
  50% {
    box-shadow: -3px -3px 25px rgba(255, 215, 0, 1),
      3px 3px 25px rgba(0, 87, 184, 1);
  }
  75% {
    box-shadow: -3px 3px 25px rgba(255, 215, 0, 1),
      -3px -3px 25px rgba(0, 87, 184, 1);
  }
  100% {
    box-shadow: 3px 3px 25px rgba(255, 215, 0, 1),
      -3px -3px 25px rgba(0, 87, 184, 1);
  }`;
