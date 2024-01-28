import Link from "next/link";
import {
  currentUser,
  UserButton,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/nextjs";
import { redirect } from "next/navigation";
import "../globals.css"; // Import the stylesheet
import HeaderForm from "./HeaderForm";
import HeaderDropdown from "./HeaderDropdown";

const url = process.env.REACT_APP_URL || "http://localhost:9000";

export default async function Header() {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }
  var response = await fetch(url + "/getUserFromEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: "jeffooi@tamu.edu" }),
  });
  var data = await response.json();
  const id = data.user.id;

  response = await fetch(url + "/getAllGroupsForUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: id }),
  });
  data = await response.json();
  const groups = data.groups;
  return (
    <nav className='min-w-full flex justify-between shadow-sm px-12 py-4'>
      <Link href='/home'>Home</Link>
      <HeaderForm userId={id}/>
      <div className='flex gap-8 justify-end'>
        <HeaderDropdown groups={groups} id={id}/>
        <div className="w-full center-flex">
          <ClerkLoading>
            <div className="h-4 w-4"></div>
          </ClerkLoading>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
        </div>
      </div>
    </nav>
  );
}
