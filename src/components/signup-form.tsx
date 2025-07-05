import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const signUpSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string({
      required_error: "ConfirmPassword is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "must match with password",
  });

type TFormData = z.infer<typeof signUpSchema>;

const SignupForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: TFormData) => {
    console.log("signUp refined data:", data);
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div>
              <form className="flex flex-col gap-5">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    Welcome to{" "}
                    <span className=" text-primary">Quick Notes</span>
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Sign up to create your account
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@example.com"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                  {errors.email && (
                    <div className="text-xs text-red-500 ml-1">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="password"
                        type="password"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                  {errors.password && (
                    <div className="text-xs text-red-500 ml-1">
                      {errors.password.message}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                  </div>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="confirm-password"
                        type="password"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <div className="text-xs text-red-500 ml-1">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  type="button"
                  className="w-full"
                >
                  SIGN UP
                </Button>
              </form>
              <div className="flex flex-col gap-5 mt-2">
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="flex justify-center items-center">
                  <Button
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    variant="outline"
                    type="button"
                    className="w-full"
                  >
                    <GoogleIcon />
                    <span className="sr-only">SignUp with Google</span>
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push("/login")}
                    className="underline underline-offset-4"
                  >
                    LogIn
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/loginImage.jpg"
              alt="Image"
              fill
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default SignupForm;
