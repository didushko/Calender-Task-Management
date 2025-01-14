import useStateInParam from "@/hooks/useParamChanger";
import styled from "styled-components";

const NavigationSearch = () => {
  const [search, setSearch] = useStateInParam("search");

  return (
    <Container>
      <InputStyled
        value={search || ""}
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
    </Container>
  );
};

export default NavigationSearch;

const Container = styled.div`
  margin: 10px 50px;
  display: flex;
  &::before {
    content: "🔍";
    display: inline-block;
    height: 24px;
    width: 24px;
  }
`;

const InputStyled = styled.input`
  padding: 5px 10px;
  border-radius: 25px;
  border: none;
  background: rgb(3, 45, 111);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  width: 100%;
  max-width: 250px;
`;
