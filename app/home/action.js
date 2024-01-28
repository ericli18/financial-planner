"use server";
import { revalidateTag } from "next/cache";

export const revalidate = () => {
  revalidateTag("todos");
};

export const deleteTodo = async (id, personal) => {
  const url = 'http://localhost:9000' //TODO: CHANGE
  const endpoint = personal ? "deletePersonalTask" : "deleteTask";
  await fetch(`${url}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personalTaskId: id }),
  });
  revalidate();
};
