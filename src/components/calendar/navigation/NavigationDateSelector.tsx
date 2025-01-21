import styled from "styled-components";
import { ViewMode } from "../ViewMode";
import useStateInParam from "@/hooks/useParamChanger";

const NavigationDateSelector = ({
  date,
  viewMode,
}: {
  date?: string;
  viewMode: ViewMode;
}) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const [selectedDate, setDate] = useStateInParam(
    "date",
    date || `${d.valueOf()}T${d.getTimezoneOffset()}`
  );

  return (
    <ChangersStyled>
      <StyledButtons
        onClick={() => {
          setDate(viewMode.getPrevDate(selectedDate!));
        }}
      >
        {"<<"}
      </StyledButtons>
      <StyledHeaderDate>
        {viewMode.getDisplayDate(selectedDate!)}
      </StyledHeaderDate>
      <StyledButtons
        onClick={() => {
          setDate(viewMode.getNextDate(selectedDate!));
        }}
      >
        {">>"}
      </StyledButtons>
      <StyledButtons
        onClick={() => {
          setDate(`${d.valueOf()}T${d.getTimezoneOffset()}`);
        }}
      >
        {"Today"}
      </StyledButtons>
    </ChangersStyled>
  );
};

export default NavigationDateSelector;

const StyledHeaderDate = styled.div`
  width: 200px;
  color: white;
  text-align: center;
  font-size: inherit;
  font-weight: bold;
`;

const StyledButtons = styled.button`
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  background-color: rgb(223, 225, 226);
  color: #000;
  &:hover {
    background-color: #838383;
  }
`;

const ChangersStyled = styled.div`
  display: flex;
  gap: 10px;
  padding: 0px;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;
