import React from 'react';
import { SignInButton, UserButton, currentUser } from '@clerk/nextjs';
import './globals.css'; // Import the stylesheet
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await currentUser();
  if(user)
  {
    redirect('/home')
  }
  return (
    <main className="mainContainer">
      <h1 className="centeredTitle">Enhanced To-Do Lists</h1>
      {!user && <SignInButton className="signInButton" />}
      <UserButton className="userButton" afterSignOutUrl="/" />
    </main>
  );
}

