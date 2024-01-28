import Link from "next/link";
import { currentUser, UserButton, SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./Dropdown";
import { DropdownMenuItemIndicator, DropdownMenuSeparator } from "./Dropdown";
import '../globals.css'; // Import the stylesheet
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
            <Link href = {'home/add'}>
              <DropdownMenuItem className = 'center-flex'>
                Add
              </DropdownMenuItem>
            </Link>
            <Link href = {'/home/join'}>
              <DropdownMenuItem className = 'center-flex'>
                Join
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserButton />
      </div>
    </nav>
  );
}
