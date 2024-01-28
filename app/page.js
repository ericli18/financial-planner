import React from 'react';
import { SignInButton, UserButton } from '@clerk/nextjs';
import './globals.css'; // Import the stylesheet

export default function Home() {
  return (
    <main className="mainContainer">
      <h1 className="centeredTitle">Enhanced To-Do Lists with sharing feasibility</h1>
      <SignInButton className="signInButton" />
      <UserButton className="userButton" afterSignOutUrl="/" />
    </main>
  );
}

