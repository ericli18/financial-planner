"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const test = async () => {
      const res = await fetch("http://localhost:9000/");
      const data = await res.json();
      console.log(data);
    }

    test();
  }, [])

  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}