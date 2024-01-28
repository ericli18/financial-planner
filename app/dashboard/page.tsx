import { Todo, defaultColumns } from "./Columns"
import { DataTable } from "./DataTable"
import Form from "./EventForm"
import { currentUser } from '@clerk/nextjs';

async function getData(): Promise<Todo[]> {
  return [
    {
      class: "Math",
      assignment: "HW 1",
      dueDate: "2020-11-01",
      completed: false,
    },
    {
      class: "Math",
      assignment: "HW 2",
      dueDate: "2020-11-02",
      completed: false,
    },
    {
      class: "English",
      assignment: "Essay 1",
      dueDate: "2020-11-03",
      completed: false,
    }
  ]
}

export default async function Page() {
  const data = await getData()

  return (
    <main className="container mx-auto py-10 min-h-screen flex flex-col gap-12 items-center">
      <Form />
      <DataTable columns={defaultColumns} data={data} />
    </main>
  )
}
