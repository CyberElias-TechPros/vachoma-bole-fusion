import { useState } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Seo } from "@/components/Seo";

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    try {
      const { success, error: resetError } = await resetPassword(email);
      if (!success) throw resetError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientLayout>
      <Seo
        title="Forgot Password"
        description="Reset your Vachoma Empire account password."
        path="/forgot-password"
        indexable={false}
      />
      <div className="container flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset password</CardTitle>
            <CardDescription>
              Enter the email you signed up with and we'll send you a reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
                <p className="text-sm text-muted-foreground">
                  If an account exists for <strong>{email}</strong>, a password reset link is on
                  its way. Please check your inbox (and spam folder).
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full">Back to login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending link…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Remembered it?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Back to login
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ForgotPasswordPage;
