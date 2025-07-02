"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const HomeNavbar = () => {
  const router = useRouter();
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left Section - Brand and Menu */}
      <div className="flex items-center space-x-8">
        <h1 className="text-2xl font-bold text-primary cursor-pointer font-serif">Quick Notes</h1>

        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li className="hover:text-primary cursor-pointer">Home</li>
          <li className="hover:text-primary cursor-pointer">Settings</li>
        </ul>
      </div>

      {/* Right Section - Auth Buttons */}
      <div className="flex space-x-4">
        <Button size={'lg'} className="cursor-pointer" onClick={() => router.push('./auth')}>LogIn</Button>
      </div>
    </nav>
  );
};

export default HomeNavbar;
