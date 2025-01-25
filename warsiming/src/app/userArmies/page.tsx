// app/user-armies/page.tsx
"use client";

import React from "react";
import UserArmyBuilder from "../components/UserArmyBuilder";
import AuthBar from "../../app/components/auth/AuthBar";      


export default function UserArmiesPage() {
  return (
    <div>
    <AuthBar />
    <UserArmyBuilder />
    </div>
  );
}
