"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import dayjs from "dayjs";
import { revalidate } from './action'

export default function Form({id}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const url = process.env.REACT_APP_URL || "http://localhost:9000";
  // TODO: Post to tasks table

  const onSubmit = async (initialData) => {
    console.log(initialData);
    console.log("hello");
    console.log(id)
    const email = "jeffooi@tamu.edu";
    const url = "http://localhost:9000"; //TODO: change
    const response2 = await fetch(`${url}/addTaskToTemplate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId: id,
        class: initialData.className,
        name: initialData.assignment,
        dueDateTime: dayjs(initialData.dueDate).format(),
      }),
    });
    revalidate();
    reset();
    console.log(response2);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex items-center justify-center'
      style={{ maxWidth: 80 + "%" }}
    >
      <Input
        placeholder='Class'
        {...register("className", { required: true })}
      />
      {/* {errors.className && <span>This field is required</span>} */}
      <Input
        placeholder='Assignment'
        {...register("assignment", { required: true })}
      />
      {/* {errors.exampleRequired && <span>This field is required</span>} */}
      <Input
        type='datetime-local'
        defaultValue={dayjs().format("YYYY-MM-DDTHH:mm")}
        {...register("dueDate", { required: true })}
      />
      {/* {errors.exampleRequired && <span>This field is required</span>} */}

      <Button type='submit'>Add task</Button>
    </form>
  );
}
