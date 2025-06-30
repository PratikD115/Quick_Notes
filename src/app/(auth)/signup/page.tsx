"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SignupPage() {
  const signupSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter the valid email"),
    password: z.string().min(1, "Password is required").min(6, "Password must be  at least 6 character"),
  });

  type TSignupFormData = z.infer<typeof signupSchema>;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<TSignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit'
  });

  const onSubmit = async (data: TSignupFormData) => {
    console.log("come to the final step after all the validation", data);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const userDetails = await res.json();
      console.log("userDetails form backend", userDetails);

    } catch (err) {
      console.error("Failed to create User:", err);
    }
    reset();
    router.push('/login')
  };

  const router = useRouter();
  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-200 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            type="text"
            {...register("name")}
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <div className="text-red-500 text-sm flex justify-end">
              {errors.name.message}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <div className="text-red-500 text-sm flex justify-end">
              {errors.email.message}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <div className="text-red-500 text-sm flex justify-end">
              {errors.password.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <span
          onClick={() => router.push("./login")}
          className="text-blue-600 hover:underline"
        >
          Login
        </span>
      </p>
    </div>
  );
}
