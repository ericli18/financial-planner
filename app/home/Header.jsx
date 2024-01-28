import Link from "next/link";
import { currentUser, UserButton, SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./Dropdown";
import { DropdownMenuItemIndicator, DropdownMenuSeparator } from "./Dropdown";
import '../globals.css'; // Import the stylesheet
import { Dialog, DialogHeader, DialogTitle } from "./Dialog";
import { DialogContent, DialogDescription, DialogTrigger } from "./Dialog";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Button } from "@/components/Button";
import HeaderForm from "./HeaderForm"


const url = process.env.REACT_APP_URL || "http://localhost:9000";

export default async function Header() {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }
  var response = await fetch(url+'/getUserFromEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email: 'jeffooi@tamu.edu'})
  })
  var data = await response.json();
  const id = data.user.id;
  
  response = await fetch(url+'/getAllGroupsForUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({userId: id})
  })
  data = await response.json();
  const groups = data.groups;
  return (
    <nav className="min-w-full flex justify-between shadow-sm px-12 py-4">
      <Link href ='/home'>Home</Link>
      <HeaderForm />
      <div className="flex gap-8 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>Groups</DropdownMenuTrigger>
          <DropdownMenuContent>
            {
              groups.map((group, i) => {
                return (
                  <Link href ={`/home/group/${group.id}`} key={i}>
                    <DropdownMenuItem className = 'center-flex' key={i}>
                      {group.name}
                    </DropdownMenuItem>
                  </Link>
                )
              })
            }
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger className="center-flex">Create Group</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Group</DialogTitle>
                    <DialogDescription>Create a new Group</DialogDescription>
                  </DialogHeader>
                    <Label>Name</Label>
                      <Input id="name" />
                    <Label>Password</Label>
                      <Input id="password" />
                    <Button type='submit'>Submit</Button>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger className="center-flex">Join Group</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join Group</DialogTitle>
                    <DialogDescription>Join an existing Group using a Password</DialogDescription>
                  </DialogHeader>
                    <Label>Password</Label>
                      <Input id="password" />
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserButton />
      </div>
    </nav>
  );
}
