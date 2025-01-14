import styled from "styled-components";
import { formatDateToString, parseStringToDate } from "../../../../lib/utils";
import { ViewMode } from "../ViewMode";
import useStateInParam from "@/hooks/useParamChanger";

const NavigationDateSelector = ({
  date,
  viewMode,
}: {
  date?: string;
  viewMode: ViewMode;
}) => {
  const [selectedDate, setDate] = useStateInParam(
    "date",
    formatDateToString(parseStringToDate(date))
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
    </ChangersStyled>
  );
};

export default NavigationDateSelector;

const StyledHeaderDate = styled.div`
  width: 200px;
  color: #000;
  text-align: center;
  font-size: large;
  font-weight: bold;
`;

const StyledButtons = styled.button`
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  background-color: rgb(223, 225, 226);
  color: #000;
`;

const ChangersStyled = styled.div`
  display: flex;
  gap: 10px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;
