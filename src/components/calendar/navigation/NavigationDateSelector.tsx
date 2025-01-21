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
        $next={false}
        onClick={() => {
          setDate(viewMode.getPrevDate(selectedDate!));
        }}
      ></StyledButtons>
      <StyledHeaderDate>
        {viewMode.getDisplayDate(selectedDate!)}
      </StyledHeaderDate>
      <StyledButtons
        $next
        onClick={() => {
          setDate(viewMode.getNextDate(selectedDate!));
        }}
      ></StyledButtons>
      <StyledToday
        onClick={() => {
          setDate(`${d.valueOf()}T${d.getTimezoneOffset()}`);
        }}
      >
        {"Today"}
      </StyledToday>
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

const StyledButtons = styled.button<{
  $next: boolean;
}>`
  cursor: pointer;
  border-radius: 5px;
  width: 25px;
  height: 25px;
  border: none;
  background-color: rgb(223, 225, 226);
  color: #000;
  background-image: ${({ $next }) =>
    $next ? 'url("/arrow_forward.png")' : 'url("/arrow_back.png")'};
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  background-position: center;
  &:hover {
    background-color: #838383;
  }
`;

const StyledToday = styled.button`
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
