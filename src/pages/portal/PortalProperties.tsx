import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PortalProperties() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Property Management</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Button onClick={() => navigate("/portal/properties/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Property
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Properties</CardTitle>
          <CardDescription>View and manage all your property listings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This will display your existing properties from MyListings page
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
