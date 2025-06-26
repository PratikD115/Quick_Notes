"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/notes");
  };

  return (
    <div
      onClick={handleClick}
      className="flex justify-center items-center text-9xl text-blue-400 font-serif h-96 cursor-pointer"
    >
      Notes
    </div>
  );
}
