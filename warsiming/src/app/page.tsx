"use client";

import React from "react";
import ParentComponent from "./components/ParentComponent";

// Main Page Component
const Page: React.FC = () => {
  return (
    <main style={{ backgroundColor: "#1a1a1a", color: "#e0e0e0", minHeight: "100vh", padding: "20px" }}>
      <ParentComponent />
    </main>
  );
};

export default Page;
