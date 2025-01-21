import useStateInParam from "@/hooks/useParamChanger";
import styled, { css, keyframes } from "styled-components";

const NavigationSearch = () => {
  const [search, setSearch, , isLoading] = useStateInParam(
    "search",
    undefined,
    undefined,
    500
  );

  return (
    <Container $loading={isLoading}>
      <InputStyled
        value={search || ""}
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
    </Container>
  );
};

export default NavigationSearch;

const l3 = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

const Container = styled.div<{ $loading?: boolean }>`
  margin: 0px 50px;
  position: relative;
  ${(props) =>
    props.$loading
      ? css`
          &::before {
            content: " ";
            display: inline-block;
            position: absolute;
            left: -25px;
            top: 0;
            height: 20px;
            width: 20px;
            padding: 2px;
            border-radius: 50%;
            background: linear-gradient(180deg, blue 0%, yellow 100%);
            --_m: conic-gradient(#0000 10%, #000),
              linear-gradient(#000 0 0) content-box;
            -webkit-mask: var(--_m);
            mask: var(--_m);
            -webkit-mask-composite: source-out;
            mask-composite: subtract;
            animation: ${l3} 1s infinite linear;
          }
        `
      : css`
          &::before {
            content: "🔍";
            display: inline-block;
            position: absolute;
            left: -20px;
            top: 6px;
          }
        `}
`;

const InputStyled = styled.input`
  padding: 5px 10px;
  border-radius: 25px;
  border: none;
  background: #303030;
  border: 1px solid gray;
  color: #fff;
  font-size: inherit;
  width: 100%;
  max-width: 250px;
`;
