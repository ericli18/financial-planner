"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const revalidate = () => {
  revalidateTag("todos");
};

export const deleteTodo = async (id, personal) => {
  const url = 'http://localhost:9000' //TODO: CHANGE
  const endpoint = personal ? "deletePersonalTask" : "deleteTask";
  const body = personal ? {personalTaskId: id} : {taskId: id};
  await fetch(`${url}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  revalidate();
};


export const createNewGroup = async (name, password) => {
  // console.log(name, password)
  const url = 'http://localhost:9000' //TODO: CHANGE
  var response = await fetch(url+'/addGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name, password})
  })
  var res = await response.json();
  // console.log(res);
  const id = res.updateSuccess;
  
  redirect(`/home/group/${id}`)
};

export const joinGroup = async (password, id) => {
  const url = 'http://localhost:9000';
  var response = await fetch(url+'/getAllGroups');
  var res = await response.json();
  var groups = res.groups.map((group) => {
    return {password: `${group.id}${group.password}`, id: group.id};
  })

  groups.filter((group) => {
    return group.password === password;
  });
  console.log(groups);
  if (groups.length > 0) {
    await fetch(url+'/addGroupToUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({groupId: groups[0].id, userId: id})
    })
    redirect(`/home/group/${groups[0].id}`);
  }
}