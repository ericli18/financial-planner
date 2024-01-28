import dayjs from "dayjs";
import { Todo, defaultColumns } from "./Columns";
import { DataTable } from "./DataTable";
import Form from "./EventForm";
import {
  SignInButton,
  SignOutButton,
  currentUser,
  useAuth,
} from "@clerk/nextjs";
import Link from "next/link"; // Import Link from Next.js

async function getData(email: string): Promise<Todo[]> {
  const url = "http://localhost:9000" //TODO: change
  const response = await fetch(`${url}/getUserFromEmail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  console.log(data.user.id)
  const response1 = await fetch(`${url}/getAllPersonalTemplatesForUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: data.user.id}),
  });
  const data1 = await response1.json();
  console.log(data1)
  const response2 = await fetch(`${url}/getTasksForPersonalTemplate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ groupId: data1.templates[0].id}),
    next: { tags: ['todos'] }
  });
  const data2 = await response2.json();
  console.log(data2)
  return data2.tasks.map((task: any) => {
    return {
      id: task.id,
      class: task.class,
      assignment: task.name,
      dueDate: dayjs(task.due_date_time).format(),
      completed: task.finished,
    }
  })
}

export default async function Page() {
  const user = await currentUser();
  // const data = await getData(user.emailAddresses[0].emailAddress);
  const data = await getData("jeffooi@tamu.edu")
  console.log(data)

  return (
    <main className='container mx-auto py-10 min-h-screen flex flex-col gap-12 items-center'>
      <Form />
      <DataTable columns={defaultColumns} data={data} />
    </main>
  );
}
