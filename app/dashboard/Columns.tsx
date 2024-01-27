"use client";

import {
  createColumnHelper, sortingFns,
} from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";

export type Todo = {
  class: string;
  assignment: string;
  dueDate: string;
  completed: boolean;
};

const columnHelper = createColumnHelper<Todo>();
  
export const defaultColumns = [
    columnHelper.accessor("class", {
      header: () => "Class",
    }),
    columnHelper.accessor("assignment", {
      header: () => "Assignment",
    }),
    columnHelper.accessor("dueDate", {
      sortingFn: sortingFns.datetime,
      header: ({column}) => {
        return (
          <button
            onClick={() => {
              console.log(column.getIsSorted());
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            Due Date
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </button>
        );
      },
    }),
    columnHelper.display({
      id: "Completed",
      cell: (props) => {
        return <input type='checkbox'></input>;
      },
      header: () => "Finished?",
    }),
    // columnHelper.display({
    //   id: "Remove",
    //   cell: ({ row }) => {
    //     const remove = () => {
    //       setData(data.filter((todo) => todo !== row.original));
    //     };
    //     return <button onClick={remove}>Remove</button>;
    //   },
    // }),
  ];