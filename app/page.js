import React from 'react';
import { SignInButton, UserButton, currentUser } from '@clerk/nextjs';
import './globals.css'; // Import the stylesheet

export default async function Home() {
  const user = await currentUser();
  return (
    <main className="mainContainer">
      <h1 className="centeredTitle">Enhanced To-Do Lists with sharing feasibility</h1>
      {!user && <SignInButton className="signInButton" />}
      <UserButton className="userButton" afterSignOutUrl="/" />
    </main>
  );
}

