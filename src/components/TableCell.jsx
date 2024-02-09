import React from "react";
import { gamePlayers } from "../utils/constants";

const TableCell = (props) => {
  const { value = null, index, onClick } = props;
  return (
    <div
      className="w-[100px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer"
      onClick={() => onClick(gamePlayers.User, index)}
    >
      <span className="text-4xl font-semibold">{value ?? ""}</span>
    </div>
  );
};

export default TableCell;
