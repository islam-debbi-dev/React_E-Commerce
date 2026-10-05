"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { login } from "../../../mutations/auth/auth-mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const initialState = {
    success: false,
    message: "",
  };

  const [state, formAction, isLoading] = useActionState(login, initialState);

  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard/overview");
      router.refresh();
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl">Shop admin</CardTitle>
          <CardDescription>
            Enter the admin key from the backend .env file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="adminKey">Admin key</Label>
                <Input
                  id="adminKey"
                  name="adminKey"
                  type="password"
                  placeholder="ADMIN_KEY"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Signing in
                    <Loader2 className="animate-spin ml-2" />
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}