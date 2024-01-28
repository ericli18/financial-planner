"use client"

import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function HeaderForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const url = process.env.REACT_APP_URL || "http://localhost:9000";

  const onSubmit = async (initialData) => {
    const groupName = initialData.groupName;
    console.log(groupName);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center max-w-md gap-1">
    <Input type="text" placeholder="Group Name#id" {...register("groupName")} />
    <Button type="submit">Pull</Button>
  </form>
  )
}