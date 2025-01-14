import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function useStateInParam(
  paramName: string,
  defaultState?: string | null | undefined,
  condition: (param: string | null | undefined) => boolean = () => true,
  debaunse: number = 0
): [
  string | null | undefined,
  (newState: string) => void,
  string | null,
  boolean
] {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const paramValue = searchParams.get(paramName);
  const [state, setState] = useState<string | null | undefined>(
    defaultState || paramValue
  );
  const { replace } = useRouter();

  const [debaunsedValue, setDebouncedValue] = useState(state);

  const isLoading = condition(debaunsedValue)
    ? paramValue !== debaunsedValue
    : paramValue !== null;

  useEffect(() => {
    const setParam = (s?: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (!s || !condition(s)) {
        params.delete(paramName);
      } else {
        params.set(paramName, s.toString());
      }
      replace(`${pathName}?${params.toString()}`);
    };
    if (isLoading) {
      setParam(debaunsedValue);
    }
  }, [
    condition,
    debaunsedValue,
    isLoading,
    paramName,
    pathName,
    replace,
    searchParams,
  ]);

  useEffect(() => {
    if (!debaunse) {
      setDebouncedValue(state);
    } else {
      const handler = setTimeout(() => {
        setDebouncedValue(state);
      }, debaunse);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [state, debaunse]);

  return [debaunsedValue, setState, paramValue, isLoading];
}

export default useStateInParam;
