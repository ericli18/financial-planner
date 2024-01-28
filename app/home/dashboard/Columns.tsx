"use client";

import { createColumnHelper, sortingFns } from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type Todo = {
  id: number;
  class: string;
  assignment: string;
  dueDate: string;
  completed: boolean;
};

const columnHelper = createColumnHelper<Todo>();

export const defaultColumns = [
  columnHelper.display({
    id: "Completed",
    cell: ({ row }) => {
      const serverId = row.original.id;
      console.log(serverId);

      return (
        <div className=''>
          <input type='checkbox'></input>
        </div>
      );
    },
    header: () => "Finished?",
  }),
  columnHelper.accessor("class", {
    header: () => "Class",
    enableHiding: true,
  }),
  columnHelper.accessor("assignment", {
    header: () => "Assignment",
  }),
  columnHelper.accessor("dueDate", {
    sortingFn: sortingFns.datetime,
    header: ({ column }) => {
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
    id: "More",
    cell: () => {
      return <MoreHorizontal className='h-4 w-4' />;
    },
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
