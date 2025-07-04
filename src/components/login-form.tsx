import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <form className="flex flex-col gap-5">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Acme Inc account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/forgotPassword");
                    }}
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                LogIn
              </Button>
            </form>
            <div className="flex flex-col gap-6">
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
                  <span className="sr-only">Login with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="underline underline-offset-4"
                >
                  Sign up
                </button>
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

export default LoginForm;
