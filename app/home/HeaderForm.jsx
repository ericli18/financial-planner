"use client"

import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { revalidate } from "./action";

export default function HeaderForm({userId}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const url = process.env.REACT_APP_URL || "http://localhost:9000";

  const onSubmit = async (initialData) => {
    const str = initialData.groupName;
    const regex = /#(\d+)(?!.*#\d)/;
    const match = str.match(regex);
    console.log(match[1], userId)
    const groupRes = await fetch(`${url}/addTemplateToUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupId: match[1], userId: userId}),
    });
    console.log(groupRes)
    console.log(match[1]);
    revalidate();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center max-w-md gap-1">
    <Input type="text" placeholder="Group Name#id" {...register("groupName")} />
    <Button type="submit">Pull</Button>
  </form>
  )
}