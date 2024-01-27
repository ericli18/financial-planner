"use client";

import { useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

function App() {
  // TODO: Make class a union type of user defined strings
  type Todo = {
    class: string;
    assignment: string;
    dueDate: string;
    completed: boolean;
  };

  const [data, setData] = useState<Array<Todo>>([]);

  const columnHelper = createColumnHelper<Todo>();

  const defaultColumns = [
    columnHelper.accessor("class", {
      header: () => "Class",
    }),
    columnHelper.accessor("assignment", {
      header: () => "Assignment",
    }),
    columnHelper.accessor("dueDate", {
      header: () => "Due Date",
    }),
    columnHelper.display({
      id: "Completed",
      cell: props => {


        return (
          <input type="checkbox"></input>
        )
      },
      header: () => "Hello",
    }),
    columnHelper.display({
      id: "Remove",
      cell: ({row}) => {
        const remove = () => {
          setData(data.filter(todo => todo !== row.original))
        }
        return (
          <button onClick={remove}>Remove</button>
        )
      }
    })
  ];

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      class: { value: string };
      assignment: { value: string };
      dueDate: { value: string };
    };
    const todo: Todo = {
      class: target.class.value,
      assignment: target.assignment.value,
      dueDate: target.dueDate.value,
      completed: false,
    };
    setData([...data, todo]);
  };

  const table = useReactTable({
    columns: defaultColumns,
    data: data,
    getCoreRowModel: getCoreRowModel<Todo>(),
  });

  // console.log(table.getAllColumns())

  return (
    <>
      <h1>To do list</h1>
      {/* {data.map((todo, index) => (
        <div key={index}>
          <h3>{todo.assignment}</h3>
          <p>{todo.dueDate}</p>
          <p>{todo.completed}</p>
        </div>
      ))} */}
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={onSubmit}>
        <input name='class' placeholder='Class' />
        <input name='assignment' placeholder='Assignment' />
        <input type='date' name='dueDate' placeholder='Due Date' />
        <button type='submit'>Add todo</button>
      </form>
    </>
  );
}

export default App;
