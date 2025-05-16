
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <ClientLayout>
      <div className="container py-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-yellow-100 p-3 rounded-full mb-4">
              <ShieldAlert className="h-10 w-10 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              If you believe this is a mistake, please contact the system administrator
              for assistance or return to the homepage.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default Unauthorized;
