import { DataTable } from "@/app/home/DataTable";
import { defaultColumns, Todo } from "@/app/home/Columns";
import Form from "@/app/home/EventForm";

async function getData() {
  return [
    {
      id: 1,
      class: "Math",
      assignment: "HW 1",
      dueDate: "2020-11-01",
      completed: false,
    },
    {
      id: 2,
      class: "Math",
      assignment: "HW 2",
      dueDate: "2020-11-02",
      completed: false,
    },
    {
      id: 3,
      class: "English",
      assignment: "Essay 1",
      dueDate: "2020-11-03",
      completed: false,
    },
  ];
}

export default async function Page({ params }) {
  const { id } = params;
  const url = process.env.REACT_URL || "http://localhost:9000";

  const tasks = await getData();

  return (
    <div className='container mx-auto py-10 min-h-screen flex flex-col gap-12 items-center'>
      <h1>Tasks for {id}</h1>
      <Form />
      <DataTable columns={defaultColumns} data={tasks} />
    </div>
  );
}
