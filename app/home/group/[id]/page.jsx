import { DataTable } from "@/app/home/DataTable";
import { defaultColumns, Todo } from "@/app/home/Columns";
import Form from "@/app/home/EventForm";
import dayjs from "dayjs";

const url = process.env.REACT_URL || "http://localhost:9000";

async function getData(id) {
  var response = await fetch(url+'/getGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: id})
  })
  var res = await response.json();
  var ret = {
    group: res.group
  }
  response = await fetch(url+'/getTasksForTemplate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({groupId: id})
  })
  res = await response.json();
  ret['tasks'] = res.tasks.map((task, i) => {
    return {
      id: task.id,
      class: task.class,
      assignment: task.name,
      dueDate: dayjs(task.due_date_time).format(),
      completed: task.finished,
    }
  });
  return ret;
}

export default async function Page({ params }) {
  const { id } = params;
  const url = process.env.REACT_URL || "http://localhost:9000";
  const tasks = await getData(id);
  console.log(tasks);

  return (
    <div className='container mx-auto py-10 min-h-screen flex flex-col gap-12 items-center'>
      <h1>Tasks for {tasks.group.name}</h1>
      {/* <Form /> */}
      <DataTable columns={defaultColumns} data={tasks.tasks} />
    </div>
  );
}
