import { Todo, defaultColumns } from "./Columns"
import { DataTable } from "./DataTable"

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
    }
  ]
}

export default async function Page() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={defaultColumns} data={data} />
    </div>
  )
}