import Link from "next/link";
import { currentUser, UserButton, SignInButton } from "@clerk/nextjs";
import { Sign } from "crypto";

export default async function Header() {
  const user = await currentUser();
  if (!user)
    return (
      <nav>
        <SignInButton />
      </nav>
    );
  return (
    <nav className="min-w-full flex justify-end gap-8 shadow-sm px-12 py-4">
      <Link href='/home/dashboard'>Dashboard</Link>
      <Link href='/home/group'>Group</Link>
      <UserButton />
    </nav>
  );
}
