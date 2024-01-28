"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import dayjs from "dayjs";

export default function Form() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const url = process.env.REACT_APP_URL || "http://localhost:9000";
  // TODO: Post to tasks table
  const onSubmit = async (data) => {
    console.log(data);
    const output = {
      email: data.className,
    };
    const res = await fetch(url + "/getUserFromEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(output),
    });
    const response = await res.json();
    console.log(response);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex items-center justify-center'
      style={{maxWidth: 80 + "%"}}
    >
      <Input
        placeholder='Class'
        {...register("className", { required: true })}
      />
      {errors.className && <span>This field is required</span>}
      <Input
        placeholder='Assignment'
        {...register("assignment", { required: true })}
      />
      {errors.exampleRequired && <span>This field is required</span>}
      <Input
        type='datetime-local'
        defaultValue={dayjs().format("YYYY-MM-DDTHH:mm")}
        {...register("dueDate", { required: true })}
      />
      {errors.exampleRequired && <span>This field is required</span>}

      <Button type='submit'>
        Add task
      </Button>
    </form>
  );
}
