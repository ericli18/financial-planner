import Link from "next/link";
import { currentUser, UserButton, SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Header() {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }
  return (
    <nav className="min-w-full flex justify-between shadow-sm px-12 py-4">
      <Link href ='/home'>Home</Link>
      <div className="flex gap-8 justify-end">
        <Link href='/home/dashboard'>Dashboard</Link>
        <Link href='/home/group'>Group</Link>
        <UserButton />
      </div>
    </nav>
  );
}
