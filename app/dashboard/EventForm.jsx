"use client"
import { useForm } from "react-hook-form"


export default function Form() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const url = process.env.REACT_APP_URL || "http://localhost:9000"
  // TODO: Post to tasks table
  const onSubmit = async (data) => 
  {
    console.log(data)
    const output = 
    {
      email: data.className,
    }
    const res = await fetch(url + "/getUserFromEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(output),
    })
    const response = await res.json()
    console.log(response)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="class" {...register("className", {required: true })} />
      {errors.className && <span>This field is required</span>}
      <input {...register("assignment", { required: true })} />
      {errors.exampleRequired && <span>This field is required</span>}
      <input type="datetime" {...register("dueDate", { required: true })} />
      {errors.exampleRequired && <span>This field is required</span>}


      <input type="submit" />
    </form>
  )
}