"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import dayjs from "dayjs";
import { revalidate } from './action'

export default function Form() {
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
    console.log("hello");
    const email = "jeffooi@tamu.edu";
    const url = "http://localhost:9000"; //TODO: change
    const response = await fetch(`${url}/getUserFromEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    console.log(data.user.id);
    const response1 = await fetch(`${url}/getAllPersonalTemplatesForUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: data.user.id }),
    });
    const data1 = await response1.json();
    const response2 = await fetch(`${url}/addPersonalTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalTemplateId: data1.templates[0].id,
        class: initialData.className,
        name: initialData.assignment,
        dueDateTime: dayjs(data.dueDate).format(),
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
