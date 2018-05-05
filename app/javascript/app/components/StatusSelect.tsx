import React from "react";

import { Filter } from "../modules/filters";

interface DataProps {
  filter: Filter;
  onChangeFilter: (filter: Filter) => void;
}

type Props = DataProps;

const StatusSelect: React.SFC<Props> = ({ onChangeFilter, filter }) => {
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilter(event.target.value as Filter);
  };

  return (
    <select onChange={handleFilterChange} value={filter}>
      <option value={Filter.ALL}>All</option>
      <option value={Filter.SUCCESS}>Success</option>
      <option value={Filter.NOT_ASKED}>Not asked</option>
      <option value={Filter.LOADING}>Loading</option>
      <option value={Filter.FAILURE}>Failure</option>
    </select>
  );
};

export default StatusSelect;
