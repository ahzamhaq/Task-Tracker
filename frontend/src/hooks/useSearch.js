import { createContext, useContext } from "react";

export const SearchContext = createContext({
  search: "",
  setSearch: () => {},
});

export const useSearch = () => useContext(SearchContext);
