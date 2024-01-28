"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { DialogClose } from "@radix-ui/react-dialog";
import { createNewGroup, joinGroup } from './action'

const HeaderDropdown = ({ groups, id }) => {
  const {register, handleSubmit, watch, reset, formState: {errors}} = useForm();

  const url = process.env.REACT_APP_URL || "http://localhost:9000";

  const createGroup = async (initialData) => {
    await createNewGroup(initialData.name, initialData.password);
    // reset();
  }

  const joinGroupFunc = async (initialData) => {
    console.log(initialData);
    await joinGroup(initialData.joinPassword, id);
    // reset();
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
              <form onSubmit={handleSubmit(createGroup)} className="flex flex-col gap-4">
                <Label>Name</Label>
                <Input id='name' {...register("name", {required: true})}/>
                <Label>Password</Label>
                <Input id='password' {...register("password", { required: true })} />
                <DialogClose asChild>
                  <Button type='submit'>Submit</Button>
                </DialogClose>
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
              <form
                onSubmit={handleSubmit(joinGroupFunc)} className="flex flex-col gap-4"
              >
                <Label>Password</Label>
                <Input id='password' {...register("joinPassword", { required: true})} />
                <DialogClose asChild>
                  <Button type='submit'>Submit</Button>
                </DialogClose>
              </form>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderDropdown;
