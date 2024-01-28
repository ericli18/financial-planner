"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Dropdown";
import {
  DropdownMenuItemIndicator,
  DropdownMenuSeparator,
} from "@/components/Dropdown";
import Link from "next/link";
import { Dialog, DialogHeader, DialogTitle } from "@/components/Dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/Dialog";
import { Label } from "@/components/Label";

const HeaderDropdown = ({ groups }) => {
  const {register, handleSubmit, watch, reset, formState: {errors}} = useForm();

  const url = process.env.REACT_APP_URL || "http://localhost:9000";
  const createNewGroup = async (initialData) => {
    console.log(initialData);
  };

  const joinGroup = async (initialData) => {
    console.log(initialData);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Groups</DropdownMenuTrigger>
      <DropdownMenuContent>
        {groups.map((group, i) => {
          return (
            <Link href={`/home/group/${group.id}`} key={i}>
              <DropdownMenuItem className='center-flex' key={i}>
                {group.name}
              </DropdownMenuItem>
            </Link>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem className='center-flex' asChild>
          <Dialog>
            <DialogTrigger className='center-flex min-w-full max-w-full'>
              Create Group
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Group</DialogTitle>
                <DialogDescription>Create a new Group</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(createNewGroup)} className="flex flex-col gap-4">
                <Label>Name</Label>
                <Input id='name' {...register("name")}/>
                <Label>Password</Label>
                <Input id='password' {...register("password")} />
                <Button type='submit'>Submit</Button>
              </form>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className='center-flex'>
          <Dialog>
            <DialogTrigger className='center-flex min-w-full max-w-full'>
              Join Group
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Group</DialogTitle>
                <DialogDescription>
                  Join an existing Group using a Password
                </DialogDescription>
              </DialogHeader>
              <Label>Password</Label>
              <Input id='password' />
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderDropdown;
