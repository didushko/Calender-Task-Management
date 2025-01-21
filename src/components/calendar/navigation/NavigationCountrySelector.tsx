"use client";
import styled from "styled-components";
import { NagerCountry } from "@/services/nagerDateService";
import useStateInParam from "@/hooks/useParamChanger";

const NavigationCountrySelector = ({
  countryList,
}: {
  countryList?: NagerCountry[] | null;
}) => {
  const [selectedCountry, setCountry] = useStateInParam(
    "country",
    undefined,
    (country) => country !== "UA"
  );

  return (
    <Container>
      <CountrySelector
        onChange={(e) => setCountry(e.target.value)}
        value={selectedCountry || "UA"}
      >
        <option value="ALL">All countries</option>
        {countryList &&
          countryList.map(({ name, countryCode }) => (
            <TabStyled key={countryCode} value={countryCode}>
              {name}
            </TabStyled>
          ))}
      </CountrySelector>
    </Container>
  );
};

export default NavigationCountrySelector;

const Container = styled.div`
  padding: 0px;
`;

const CountrySelector = styled.select<{
  $loading?: boolean;
}>`
  cursor: pointer;
  padding: 5px;
  border-radius: 25px;
  border: none;
  background-color: #303030;
  border: 1px solid gray;
  color: #fff;
`;

const TabStyled = styled.option<{
  $selected?: boolean;
}>``;
