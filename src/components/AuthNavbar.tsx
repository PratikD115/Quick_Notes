"use client";

import { useRouter } from "next/navigation";

const AuthNavbar = () => {
  const router = useRouter();

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left Section - Brand and Menu */}
      <div className="flex items-center space-x-8">
        <h1 onClick={() => router.push('/')} className="text-2xl font-bold text-blue-600">Quick Notes</h1>
      </div>
    </nav>
  );
};

export default AuthNavbar;
