import { useMediaQuery } from "react-responsive";

export const useIsTabletOrMobile = () =>
  useMediaQuery({ query: "(max-width: 1224px)" });
